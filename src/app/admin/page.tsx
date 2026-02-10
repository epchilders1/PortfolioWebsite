
import './Admin.css';
import AdminPage from './AdminPage';
import type { Project } from '../types';
import { api } from '~/trpc/server';
import { auth } from '~/server/auth';

export default async function Admin(){
    const homeInfo = await api.home.getAllInfo();
    const session = await auth();

    async function upsertProject(project:Project){
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

    async function deleteProject(id: string){
        "use server";
        try{
            await api.project.deleteProject({id});
        }
        catch(e){
            return new Error("Something went wrong when deleting the project.")
        }
    }
    return(
        <AdminPage upsertProject = {upsertProject} projects = {homeInfo.projects} session={session} deleteProject={deleteProject}/>
    );
}