"use client"

import './Projects.css'
import './ProjectModal.css'
import { useState } from 'react'
import type { Project } from '../../types'
import { GlowCard } from '~/app/_components/ui/glow-card'
import { X } from 'lucide-react'
import Modal from './Modal'
import { useEffect, useRef } from 'react';

interface ProjectProps {
    projects: Project[]
}

function truncateToFirstSentence(text: string): string {
    const dotIndex = text.indexOf('.')
    if (dotIndex === -1) return text
    return text.substring(0, dotIndex + 1)
}

export default function ProjectsSection(props: ProjectProps) {
    const { projects } = props;
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleCardClick = (project: Project) => {
        setSelectedProject(project)
        setModalOpen(true)
    }

    const sectionRef = useRef<HTMLDivElement>(null);
        
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    console.log(projects);
    return (
        <div id="projects-section" className="projects-container" ref={sectionRef}>
            <h1>Projects</h1>
            <div className="projects-grid">
                {projects.filter(p => !p.hidden).map((project) => (
                    <div
                        key={project.id}
                        onClick={() => handleCardClick(project)}
                        style={{ cursor: 'pointer' }}
                    >
                        <GlowCard variant="cosmic" intensity={1.2} className="project-card shadow-gray-500/30 shadow-md border">
                            <img
                                className="project-image"
                                src={project.heroImage}
                                alt={project.name}
                            />
                            <div className="project-content">
                                <h2 className="project-name">{project.name}</h2>
                                <p className="project-description">{truncateToFirstSentence(project.description)}</p>
                                {project.tags && (
                                    <div className="project-tags">
                                        {project.tags.map((tag, index) => (
                                            <span key={index} className="project-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="project-links">
                                    {project.gitHubURL && (
                                        <a
                                            href={project.gitHubURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img src="./icons/github.png" alt="GitHub" />
                                            GitHub
                                        </a>
                                    )}
                                    {project.hostedURL && (
                                        <a
                                            href={project.hostedURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="project-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Live URL
                                        </a>
                                    )}
                                </div>
                            </div>
                        </GlowCard>
                    </div>
                ))}
            </div>

            <Modal showModal={modalOpen} setShowModal={setModalOpen} containerClasses="project-modal-container">
                {selectedProject && (
                    <>
                        <img
                            className="project-modal-image"
                            src={selectedProject.heroImage}
                            alt={selectedProject.name}
                        />
                        <h2 className="project-modal-title">{selectedProject.name}</h2>
                        <p className="project-modal-description">{selectedProject.description}</p>
                         {selectedProject.tags && (
                                    <div className="project-tags">
                                        {selectedProject.tags.map((tag, index) => (
                                            <span key={index} className="project-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                        <div className="project-modal-blog-posts">
                            {selectedProject.blogPosts && selectedProject.blogPosts.length > 0 && (
                                <>
                                    <p className="project-modal-blog-posts-label">Related Posts</p>
                                    <ul className="blog-posts-list">
                                        {selectedProject.blogPosts.map((post) => (
                                            <li key={post.id} className="blog-post-item">
                                                {post.heroImage && (
                                                    <img
                                                        src={post.heroImage}
                                                        alt={post.headline}
                                                    />
                                                )}
                                                <a href={`/blog/${post.id}`} className="blog-post-link">
                                                    {post.headline}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                        <div className="project-modal-links">
                            {selectedProject.gitHubURL && (
                                <a href={selectedProject.gitHubURL} target="_blank" rel="noopener noreferrer" className="project-link">
                                    <img src="./icons/github.png" alt="GitHub" />
                                    GitHub
                                </a>
                            )}
                            {selectedProject.hostedURL && (
                                <a href={selectedProject.hostedURL} target="_blank" rel="noopener noreferrer" className="project-link">
                                    Live URL
                                </a>
                            )}
                        </div>

                        <button className="project-modal-close" onClick={() => setModalOpen(false)}>
                            <X size={20} />
                        </button>
                    </>
                )}
            </Modal>
        </div>
    );
}
