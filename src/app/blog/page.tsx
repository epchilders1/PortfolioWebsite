import BlogPage from "./BlogPage";
import { api } from "~/trpc/server";
import type { BlogPost } from "../types";

export default async function Blog(){
    const homeInfo = await api.home.getAllInfo();

    const blogPosts: BlogPost[] = homeInfo.blogPosts.map((post) => ({
        id: post.id,
        headline: post.headline,
        markDownContent: post.markDownContent,
        heroImage: post.heroImage,
        hidden: post.hidden,
        datePosted: post.createdAt.toISOString().split("T")[0],
        readTimeMinutes: post.readTimeMinutes,
        project: post.project !== null ? post.project : undefined,
    }));

    return(
        <BlogPage blogPosts={blogPosts}/>
    )
}
