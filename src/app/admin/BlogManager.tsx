"use client";

import { useState } from "react";
import "./BlogManager.css";
import "./ProjectManager.css";
import type { Project } from "../types";
import { FileTypes } from "../types";
import HeroImageSelector from "../_components/HeroImageSelector/HeroImageSelector";
import { Eye, EyeClosed, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import MarkdownEditor from "./MarkdownEditor";


interface BlogPostFormData {
    id?: string;
    headline: string;
    heroImage: string;
    markDownContent: string;
    datePosted: string;
    readTimeMinutes?: number | null;
    hidden: boolean;
    projectId: string | null;
}

type DbBlogPost = {
    id: string;
    headline: string;
    heroImage: string | null;
    markDownContent: string;
    hidden: boolean;
    projectId: string | null;
    createdAt: Date | string;
    readTimeMinutes?: number | null;
};

type UpsertPostInput = {
    id?: string;
    headline: string;
    heroImage: string;
    markDownContent: string;
    hidden: boolean;
    projectId: string | null;
    readTimeMinutes?: number | null;
};

interface BlogManagerProps {
    blogPosts?: DbBlogPost[];
    projects?: Project[];
    upsertPost: (data: UpsertPostInput) => Promise<{ id: string }>;
    deletePost: (id: string) => Promise<void>;
}


const today = new Date().toISOString().split("T")[0] ?? "";

const emptyForm: BlogPostFormData = {
    headline: "",
    heroImage: "",
    markDownContent: "",
    datePosted: today,
    readTimeMinutes: 5,
    hidden: false,
    projectId: null,
};

function dbToForm(post: DbBlogPost): BlogPostFormData {
    return {
        id: post.id,
        headline: post.headline,
        heroImage: post.heroImage ?? "",
        markDownContent: post.markDownContent,
        hidden: post.hidden,
        projectId: post.projectId ?? null,
        datePosted: post.createdAt
            ? new Date(post.createdAt).toISOString().split("T")[0] ?? today
            : today,
        readTimeMinutes: post.readTimeMinutes ?? null,
    };
}


export default function BlogManager({ blogPosts = [], projects = [], upsertPost, deletePost }: BlogManagerProps) {
    const [localPosts, setLocalPosts] = useState<BlogPostFormData[]>(
        blogPosts.map(dbToForm)
    );
    const [editing, setEditing] = useState<BlogPostFormData | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const [editorKey, setEditorKey] = useState(0);
    const [mdPasteOpen, setMdPasteOpen] = useState(false);
    const [mdPasteText, setMdPasteText] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editing) return;
        setSaving(true);

        let heroImage = editing.heroImage;

        if (imageFile) {
            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("type", FileTypes.BlogPostHeros);
            const res = await fetch("/api/upload-image", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                toast.error("Image upload failed.");
                setSaving(false);
                return;
            }
            const data = await res.json() as { fileUrl: string };
            heroImage = data.fileUrl;
        }

        if (!heroImage) {
            toast.error("Please upload a hero image.");
            setSaving(false);
            return;
        }

        try {
            const saved = await upsertPost({
                id: editing.id,
                headline: editing.headline,
                heroImage,
                markDownContent: editing.markDownContent,
                hidden: editing.hidden,
                projectId: editing.projectId,
                readTimeMinutes: editing.readTimeMinutes,
            });

            const updatedPost: BlogPostFormData = { ...editing, id: saved.id, heroImage };

            setLocalPosts((prev) => {
                const exists = prev.find((p) => p.id === editing.id);
                if (exists) return prev.map((p) => (p.id === editing.id ? updatedPost : p));
                return [updatedPost, ...prev];
            });

            toast.success("Blog post saved!");
            setEditing(null);
            setImageFile(null);
        } catch {
            toast.error("There was an error saving the post, please try again.");
        }

        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        try {
            const post = localPosts.find((p) => p.id === id);
            await deletePost(id);

            // Delete all S3 images embedded in the post's markdown content
            if (post) {
                const imageUrls: string[] = [];
                const mdImageRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/g;
                let match;
                while ((match = mdImageRegex.exec(post.markDownContent)) !== null) {
                    if (match[1]) imageUrls.push(match[1]);
                }
                if (post.heroImage) imageUrls.push(post.heroImage);
                if (imageUrls.length > 0) {
                    await fetch("/api/delete-image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ deletedImage: imageUrls }),
                    });
                }
            }

            setLocalPosts((prev) => prev.filter((p) => p.id !== id));
            if (editing?.id === id) {
                setEditing(null);
                setImageFile(null);
            }
            toast.success("Post deleted.");
        } catch {
            toast.error("There was an error deleting the post, please try again.");
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", FileTypes.BlogPostImages);
        const res = await fetch("/api/upload-image", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json() as { fileUrl: string };
        return data.fileUrl;
    };

    const startEdit = (post: BlogPostFormData) => {
        setEditing({ ...post });
        setImageFile(null);
    };

    const startCreate = () => {
        setEditing({ ...emptyForm });
        setImageFile(null);
    };

    return (
        <div className="bm-container">
            <Toaster />

            <div className="pm-header">
                <h2 className="pm-title">Blog Posts</h2>
                {!editing && (
                    <button className="pm-btn pm-btn-primary" onClick={startCreate}>
                        + New Blog Post
                    </button>
                )}
            </div>

            {editing && (
                <form className="pm-form bm-form" onSubmit={handleSubmit}>
                    <div className="pm-header-container">
                        <h3 className="pm-form-title">
                            {editing.id ? "Edit Post" : "New Post"}
                        </h3>
                        <button
                            type="button"
                            className="pm-visibility-toggle"
                            onClick={() => setEditing({ ...editing, hidden: !editing.hidden })}
                            title={editing.hidden ? "Hidden — click to show" : "Visible — click to hide"}
                        >
                            {editing.hidden ? <EyeClosed /> : <Eye />}
                        </button>
                    </div>

                    <div className="bm-meta-grid">
                        <div className="pm-field bm-hero-field">
                            <label>Hero Image</label>
                            <HeroImageSelector
                                currentImage={editing.heroImage}
                                onImageChange={(file) => setImageFile(file)}
                            />
                            {/* {editing.heroImage && !imageFile && (
                                <p className="pm-hint">Current: {editing.heroImage}</p>
                            )} */}
                            {imageFile && (
                                <p className="pm-hint">Selected: {imageFile.name}</p>
                            )}
                        </div>

                        <div className="bm-meta-fields">
                            <div className="pm-field">
                                <label>Headline</label>
                                <input
                                    type="text"
                                    value={editing.headline}
                                    onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
                                    placeholder="Post title..."
                                    required
                                />
                            </div>

                            <div className="bm-row">
                                <div className="pm-field">
                                    <label>Date Posted</label>
                                    <input
                                        type="date"
                                        value={editing.datePosted}
                                        onChange={(e) =>
                                            setEditing({ ...editing, datePosted: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="pm-field">
                                    <label>Read Time (min)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={editing.readTimeMinutes ?? ""}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            setEditing({
                                                ...editing,
                                                readTimeMinutes: isNaN(val) ? null : val,
                                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="pm-field">
                                <label>Related Project</label>
                                <select
                                    className="bm-select"
                                    value={editing.projectId ?? ""}
                                    onChange={(e) =>
                                        setEditing({
                                            ...editing,
                                            projectId: e.target.value || null,
                                        })
                                    }
                                >
                                    <option value="">None</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pm-field bm-editor-field">
                        <div className="bm-editor-label-row">
                            <label>Content</label>
                            <button
                                type="button"
                                className="pm-btn pm-btn-ghost bm-paste-toggle"
                                onClick={() => { setMdPasteOpen((v) => !v); setMdPasteText(""); }}
                            >
                                {mdPasteOpen ? "Cancel" : "Paste Markdown"}
                            </button>
                        </div>
                        {mdPasteOpen && (
                            <div className="bm-md-paste">
                                <textarea
                                    className="bm-md-paste-area"
                                    value={mdPasteText}
                                    onChange={(e) => setMdPasteText(e.target.value)}
                                    placeholder="Paste raw markdown here…"
                                    rows={8}
                                />
                                <button
                                    type="button"
                                    className="pm-btn pm-btn-primary"
                                    onClick={() => {
                                        setEditing({ ...editing, markDownContent: mdPasteText });
                                        setEditorKey((k) => k + 1);
                                        setMdPasteText("");
                                        setMdPasteOpen(false);
                                    }}
                                >
                                    Load into Editor
                                </button>
                            </div>
                        )}
                        <div className="bm-editor-wrapper">
                            <MarkdownEditor
                                key={`${editing.id ?? "new"}-${editorKey}`}
                                markdown={editing.markDownContent}
                                onChange={(val) =>
                                    setEditing({ ...editing, markDownContent: val })
                                }
                                imageUploadHandler={handleImageUpload}
                            />
                        </div>
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
                </form>
            )}

            {localPosts.length === 0 && !editing && (
                <p className="pm-empty">No blog posts yet. Create your first one.</p>
            )}

            <div className="pm-list">
                {localPosts
                    .filter((p) => p.id !== editing?.id)
                    .map((post) => (
                        <div key={post.id} className="pm-card bm-card">
                            {post.heroImage && (
                                <img
                                    className="bm-card-thumb"
                                    src={post.heroImage}
                                    alt={post.headline}
                                />
                            )}
                            <div className="pm-card-info">
                                <a href={`/blog/${post.id}`}>
                                    <h3 className="bm-card-headline">{post.headline}</h3>
                                </a>
                                <div className="bm-card-meta">
                                    {post.projectId && projects.find((p) => p.id === post.projectId) && (
                                        <>
                                            <span className="bm-card-project">
                                                {projects.find((p) => p.id === post.projectId)?.name}
                                            </span>
                                            <span>·</span>
                                        </>
                                    )}
                                    <span>{post.readTimeMinutes} min</span>
                                    {post.hidden && <EyeClosed size={13} />}
                                </div>
                            </div>
                            <div className="pm-card-actions">
                                <button
                                    className="pm-btn pm-btn-ghost"
                                    onClick={() => startEdit(post)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="pm-btn pm-btn-danger"
                                    onClick={() => post.id && handleDelete(post.id)}
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
