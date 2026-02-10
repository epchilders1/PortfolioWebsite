import ProjectManager from "./ProjectManager";
import type { Project } from "../types";

interface AdminProps{
    upsertProject: any
    projects: Project[]
    session: any
    deleteProject: any
}

export default function AdminPage(props:AdminProps){
    const {upsertProject, projects, session, deleteProject} = props;
    return(
        <div className="admin-container">
            <ProjectManager upsertProject={upsertProject} projects={projects} session={session} deleteProject={deleteProject}/>
        </div>
    );
}