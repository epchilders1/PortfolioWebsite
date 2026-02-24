"use client";
import './BlogPostItem.css';
import { Clock, Calendar, ExternalLink, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BlogPostItemProps{
    post: {
        id: string;
        headline: string;
        markDownContent: string;
        heroImage?: string | null;
        datePosted?: string;
        readTimeMinutes?: number | null;
        project?: {
            name: string;
            hostedURL?: string | null;
            gitHubURL?: string | null;
        };
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function BlogPostItem(props: BlogPostItemProps){
    const { post, onEdit, onDelete } = props;
    const router = useRouter();
    // console.log(post);

    return(
        <li className="blog-card" onClick={() => router.push(`/blog/${post.id}`)}>
            <div className="blog-card-thumbnail-wrapper">
                {post.heroImage && (
                    <img
                        className="blog-card-thumbnail"
                        src={post.heroImage}
                        alt={post.headline}
                    />
                )}
            </div>

            <div className="blog-card-body">
                <h2 className="blog-card-title">{post.headline}</h2>

                <div className="blog-card-meta">
                    {post.datePosted && (
                        <>
                            <span className="blog-card-meta-item">
                                <Calendar size={13} />
                                {formatDate(post.datePosted)}
                            </span>
                            {post.readTimeMinutes && (
                                <span className="blog-card-meta-divider">·</span>
                            )}
                        </>
                    )}
                    {post.readTimeMinutes && (
                        <span className="blog-card-meta-item">
                            <Clock size={13} />
                            {post.readTimeMinutes} min read
                        </span>
                    )}
                </div>

                {post.project && (
                    <div className="blog-card-project">
                        <span className="blog-card-project-label">Project:</span>
                        <a
                            href={post.project.hostedURL ?? post.project.gitHubURL ?? '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blog-card-project-link"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!post.project?.hostedURL && !post.project?.gitHubURL) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            {post.project.name}
                            <ExternalLink size={11} />
                        </a>
                    </div>
                )}
            </div>

            {(onEdit ?? onDelete) && (
                <div className="blog-card-actions">
                    {onEdit && (
                        <button
                            className="blog-card-action-btn"
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            title="Edit"
                        >
                            <Pencil size={14} />
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            className="blog-card-action-btn blog-card-action-btn--danger"
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            title="Delete"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}
        </li>
    );
}
