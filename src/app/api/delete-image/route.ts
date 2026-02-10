import { NextRequest, NextResponse } from "next/server";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const imageUrl = body.deletedImage;
        if (!imageUrl) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        if (!process.env.AWS_S3_BUCKET_NAME) {
            return NextResponse.json({ error: "Bucket name is not defined" }, { status: 500 });
        }
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Delete: {
                Objects: imageUrl.map((url:string) => {
                    const key = url.replace(/^https?:\/\/[^/]+\/?/, '');
                    console.log("Generated key for deletion:", key);
                    return { Key: key };
                }),
            },
        };

        const result = await s3.deleteObjects(deleteParams).promise();

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Error deleting images:", error);
        return NextResponse.json({ error: "Failed to delete images" }, { status: 500 });
    }
}