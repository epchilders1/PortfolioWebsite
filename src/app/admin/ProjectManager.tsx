"use client";

import { useState } from 'react';
import './ProjectManager.css'
import type { Project } from '../types';
import HeroImageSelector from '../_components/HeroImageSelector/HeroImageSelector';
import {Eye, EyeClosed, X} from 'lucide-react';
import { FileTypes } from '../types';
import { Toaster, toast } from "react-hot-toast";

interface ProjectFormData {
    id?: string;
    name: string;
    heroImage: string;
    description: string;
    gitHubURL: string;
    hostedURL: string;
    hidden: boolean;
    tags?: string[];
    tagsInput?: string;
    precedence?: number;
}

const emptyForm: ProjectFormData = {
    name: "",
    heroImage: "",
    description: "",
    gitHubURL: "",
    hostedURL: "",
    hidden: false,
    tags: [],
    precedence: 0,
};

interface ProjectManagerProps {
    upsertProject: (project: Project) => Promise<Project>
    projects: Project[],
    session: any,
    deleteProject: any
}

export default function ProjectManager(props: ProjectManagerProps) {
    const { upsertProject, projects, session, deleteProject } = props;
    const [localProjects, setLocalProjects] = useState<Project[]>(projects);
    const [editing, setEditing] = useState<ProjectFormData | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;

        setSaving(true);

        let heroImage = editing.heroImage;

        if (imageFile) {
          const formData = new FormData();
          formData.append("image", imageFile);
          formData.append("type", FileTypes.ProjectHeros)
          const res = await fetch(`/api/upload-image`, {
                method: 'POST',
                body: formData,
            })
          if (!res.ok) {
            toast.error("Image upload failed.");
            setSaving(false);
            return;
          }
          const data = await res.json();
          heroImage = data.fileUrl;
        }

        if (!heroImage) {
          toast.error("Please upload a hero image.");
          setSaving(false);
          return;
        }

        try{
           const newProject = await upsertProject({
                id: editing.id ?? "",
                name: editing.name,
                heroImage,
                description: editing.description,
                gitHubURL: editing.gitHubURL ?? null,
                hostedURL: editing.hostedURL ?? null,
                hidden: editing.hidden,
                tags: editing.tags ?? [],
                precedence: editing.precedence ?? 0,
            });
            toast.success("Project saved successfully!")
            setLocalProjects((prev) => {
                const exists = prev.find((p) => p.id === newProject.id);
                if (exists) {
                    return prev.map((p) => (p.id === newProject.id ? newProject : p));
                }
                return [newProject, ...prev];
            });
        }
        catch(e){
            toast.error("There was an error when trying to save the project, please try again.")
        }
        setSaving(false);
        setEditing(null);
        setImageFile(null);
    };

    const handleDelete = async (id: string) => {

        try{
            if (editing?.heroImage) {
                const formData = new FormData();
                formData.append("deletedImage", editing?.heroImage ?? "");
                const res = await fetch(`/api/delete-image`, {
                        method: 'POST',
                        body: formData,
                    })
                if (!res.ok) {
                    toast.error("Image upload failed.");
                    setSaving(false);
                    return;
                }
                const data = await res.json();
            }
            await deleteProject(id);
            toast.success("Project deleted successfully!")
            setLocalProjects((prev) => prev.filter((p) => p.id !== id));
             if (editing?.id === id) {
                setEditing(null);
                setImageFile(null);
            }
        }
        catch(e){
            toast.error("There was an error when trying to delete the project, please try again.")
        }
    }


    const startEdit = (project: Project) => {
        setEditing({
            id: project.id,
            name: project.name,
            heroImage: project.heroImage,
            description: project.description,
            gitHubURL: project.gitHubURL ?? "",
            hostedURL: project.hostedURL ?? "",
            hidden: project.hidden,
            tags: project.tags ?? [],
            tagsInput: project.tags?.join(", ") ?? "",
            precedence: project.precedence ?? 0,
        });
        setImageFile(null);
    };

    const startCreate = () => {
        setEditing({ ...emptyForm });
        setImageFile(null);
    };

    const onImageChange = (file: File | null) => {
        setImageFile(file)
    }

    return (
        <div className="pm-container">
            <Toaster/>
            <div className="pm-header">
                <h2 className="pm-title">Projects</h2>
                {!editing && (
                    <button className="pm-btn pm-btn-primary" onClick={startCreate}>
                        + New Project
                    </button>
                )}
            </div>

            {editing && (
                <form className="pm-form" onSubmit={handleSubmit}>
                    <div className="pm-header-container">
                        <h3 className="pm-form-title">
                            {editing.id ? "Edit Project" : "New Project"}
                        </h3>
                        <button
                            type="button"
                            className={`pm-visibility-toggle `}
                            onClick={() => setEditing({ ...editing, hidden: !editing.hidden })}
                            title={editing.hidden ? "Hidden — click to show" : "Visible — click to hide"}
                        >
                            {editing.hidden ? <EyeClosed /> : <Eye />}
                        </button>
                    </div>
                    <div className="pm-field">
                        <label>Hero Image</label>
                        <HeroImageSelector currentImage={editing.heroImage} onImageChange={onImageChange}/>
                        {editing.heroImage && !imageFile && (
                            <p className="pm-hint">Current: {editing.heroImage}</p>
                        )}
                        {imageFile && (
                            <p className="pm-hint">Selected: {imageFile.name}</p>
                        )}
                    </div>
                    <div className="pm-field">
                        <label>Name</label>
                        <input
                            type="text"
                            value={editing.name}
                            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="pm-field">
                        <label>Description</label>
                        <textarea
                            value={editing.description}
                            onChange={(e) =>
                                setEditing({ ...editing, description: e.target.value })
                            }
                            rows={3}
                            required
                        />
                    </div>

                   

                    <div className="pm-field">
                        <label>GitHub URL</label>
                        <input
                            type="url"
                            value={editing.gitHubURL}
                            onChange={(e) =>
                                setEditing({ ...editing, gitHubURL: e.target.value })
                            }
                            placeholder="https://github.com/..."
                        />
                    </div>

                    <div className="pm-field">
                        <label>Hosted URL</label>
                        <input
                            type="url"
                            value={editing.hostedURL}
                            onChange={(e) =>
                                setEditing({ ...editing, hostedURL: e.target.value })
                            }
                            placeholder="https://..."
                        />
                    </div>

                   

                    <div className="pm-form-actions">
                        <button
                            type="submit"
                            className="pm-btn pm-btn-primary"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            className="pm-btn pm-btn-ghost"
                            onClick={() => {
                                setEditing(null);
                                setImageFile(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="pm-tags" >
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            value={editing.tagsInput ?? editing.tags?.join(", ") ?? ""}
                            onChange={(e) =>
                                setEditing({ ...editing, tagsInput: e.target.value, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })
                            }
                            placeholder="Machine Learning, React, DevOps"
                        />
                    </div>
                    <div className="pm-precedence" >
                        <label>Precedence (higher numbers show first)</label>
                        <input
                            type="number"
                            value={editing.precedence ?? 0}
                            onChange={(e) =>
                                setEditing({ ...editing, precedence: parseInt(e.target.value, 10) ?? 0 })
                            }
                            placeholder="0"
                        />
                    </div>
                </form>
            )}

            {localProjects.length === 0 && !editing && (
                <p className="pm-empty">No projects yet. Create your first one.</p>
            )}

            <div className="pm-list">
                {localProjects.filter((p) => p.id !== editing?.id).map((project) => (
                    <div key={project.id} className="pm-card">
                        <div className="pm-card-info">
                            <h3>{project.name}</h3>
                            <p>{project.description}</p>
                            <div className="pm-card-meta">
                                {project.hidden && <EyeClosed/>}
                                {project.gitHubURL && (
                                    <a href={project.gitHubURL} target="_blank" rel="noopener noreferrer">
                                        GitHub
                                    </a>
                                )}
                                {project.hostedURL && (
                                    <a href={project.hostedURL} target="_blank" rel="noopener noreferrer">
                                        Live
                                    </a>
                                )}
                            </div>
                            {project.tags && project.tags.length > 0 && (
                                <div className="pm-card-tags">
                                    {project.tags.map((tag, index) => (
                                        <span key={index} className="pm-card-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                            {project.precedence !== undefined && (
                                <div className="pm-card-precedence">
                                    Precedence: {project.precedence}
                                </div>
                            )}
                        </div>
                        <div className="pm-card-actions">
                            <button
                                className="pm-btn pm-btn-ghost"
                                onClick={() => startEdit(project)}
                            >
                                Edit
                            </button>
                            <button
                                className="pm-btn pm-btn-danger"
                                onClick={() => handleDelete(project.id)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
