import { api } from "~/trpc/server";
import type { BlogPost } from "~/app/types";
import BlogPostPage from "./BlogPostPage";




export default async function BlogPost({ params }: { params: { id: string } }) {
    const { id } = params;
    const raw = await api.post.getBlogPostById({ id });

    if (!raw) {
        return <div>Blog post not found</div>;
    }

    const blogPost: BlogPost = {
        id: raw.id,
        headline: raw.headline,
        markDownContent: raw.markDownContent,
        heroImage: raw.heroImage,
        hidden: raw.hidden,
        datePosted: raw.createdAt.toISOString().split("T")[0],
        readTimeMinutes: raw.readTimeMinutes,
        project: raw.project ?? undefined,
    };

    return (
        <BlogPostPage post={blogPost} />
    );
}