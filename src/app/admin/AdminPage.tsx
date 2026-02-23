import ProjectManager from "./ProjectManager";
import BlogManager from "./BlogManager";
import type { Project } from "../types";

interface AdminProps{
    upsertProject: any
    projects: Project[]
    blogPosts: any[]
    session: any
    deleteProject: any
    upsertPost: any
    deletePost: any
}

export default function AdminPage(props: AdminProps){
    const { upsertProject, projects, blogPosts, session, deleteProject, upsertPost, deletePost } = props;
    return(
        <div className="admin-container">
            <ProjectManager upsertProject={upsertProject} projects={projects} session={session} deleteProject={deleteProject}/>
            <BlogManager projects={projects} blogPosts={blogPosts} upsertPost={upsertPost} deletePost={deletePost}/>
        </div>
    );
}
