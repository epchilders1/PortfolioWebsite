
import './Admin.css';
import AdminPage from './AdminPage';
import type { Project } from '../types';
import { api } from '~/trpc/server';
import { auth } from '~/server/auth';

type UpsertPostInput = {
    id?: string;
    headline: string;
    heroImage: string;
    markDownContent: string;
    hidden: boolean;
    projectId: string | null;
    readTimeMinutes?: number | null;
};

export default async function Admin(){
    const homeInfo = await api.home.getAllInfo();
    const session = await auth();

    async function upsertProject(project: Project){
        "use server";
        try{
            const upsertedProject = await api.project.upsertProject({
                ...project,
                gitHubURL: project.gitHubURL ?? undefined,
                hostedURL: project.hostedURL ?? undefined,
            });
            return upsertedProject;
        }
        catch(e){
            throw new Error("Something went wrong when upserting the project.")
        }
    }

    async function upsertPost(data: UpsertPostInput){
        "use server";
        try{
            const upsertedPost = await api.post.upsertBlogPost({
                id: data.id,
                headline: data.headline,
                heroImage: data.heroImage,
                markDownContent: data.markDownContent,
                hidden: data.hidden,
                projectId: data.projectId,
                readTimeMinutes: data.readTimeMinutes ?? null,
            });
            return upsertedPost;
        }
        catch(e){
            throw new Error("Something went wrong when upserting the blog post.")
        }
    }

    async function deletePost(id: string){
        "use server";
        try{
            await api.post.deleteBlogPost({ id });
        }
        catch(e){
            throw new Error("Something went wrong when deleting the blog post.")
        }
    }

    async function deleteProject(id: string){
        "use server";
        try{
            await api.project.deleteProject({ id });
        }
        catch(e){
            throw new Error("Something went wrong when deleting the project.")
        }
    }

    return(
        <AdminPage
            upsertProject={upsertProject}
            projects={homeInfo.projects}
            blogPosts={homeInfo.blogPosts}
            session={session}
            deleteProject={deleteProject}
            upsertPost={upsertPost}
            deletePost={deletePost}
        />
    );
}
