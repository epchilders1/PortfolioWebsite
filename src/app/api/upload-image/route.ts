import { NextRequest, NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";
import { auth } from "~/server/auth";

const s3 = new S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
  });

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/svg+xml'
];

export async function POST(req: NextRequest) {
  try {

    // Verify authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("image") as File;
    const type = formData.get("type") as string;

    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!type) {
        return NextResponse.json({ error: "Missing type" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({
            error: "Invalid file type. Allowed types: JPEG, PNG, GIF, WebP, AVIF"
        }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate safe filename with timestamp to prevent overwrites/collisions
    const fileExtension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const safeExtension = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(fileExtension) ? fileExtension : 'jpg';
    const timestamp = Date.now();
    const fileName = `${type}/${file.name}/${timestamp}.${safeExtension}`;
    if (!process.env.AWS_S3_BUCKET_NAME) {
        throw new Error("AWS_BUCKET_NAME is not defined");
    }
    const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Prefix: `${type}/`,
      };
  

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, 
        Key: fileName, 
        Body: buffer,
        ContentType: file.type, 
        ACL: "public-read", 
    };
    const data = await s3.upload(uploadParams).promise();
    
    console.log("File uploaded to S3:", data.Location);
    return NextResponse.json({ message: "File uploaded successfully", fileUrl: data.Location });
  } catch (error) {

    console.error("Error handling request:", error);
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
