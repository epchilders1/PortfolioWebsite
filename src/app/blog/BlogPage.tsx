"use client";

import { useState, useMemo } from 'react';
import './BlogPage.css';
import type { BlogPost, Project } from '../types';
import BlogSearchBar, { type BlogFilters } from '../_components/BlogSearchBar/BlogSearchBar';
import { Clock, Calendar, ExternalLink } from 'lucide-react';
import BlogPostItem from './BlogPostItem';



interface BlogPageProps {
    blogPosts?: BlogPost[];
}


export default function BlogPage(props: BlogPageProps) {
    const {blogPosts = []} = props;
    console.log(blogPosts);
    const [filters, setFilters] = useState<BlogFilters>({
        query: '',
        sortOrder: 'newest',
        projectId: null,
    });

    const filterProjects = useMemo(() => {
        const seen = new Set<string>();
        const list: { id: string; name: string }[] = [];
        for (const post of blogPosts) {
            if (post.project && !seen.has(post.project.id)) {
                seen.add(post.project.id);
                list.push({ id: post.project.id, name: post.project.name });
            }
        }
        return list;
    }, [blogPosts]);

    const filtered = useMemo(() => {
        let result = blogPosts.filter((post) => {
            const matchesQuery = post.headline
                .toLowerCase()
                .includes(filters.query.toLowerCase());
            const matchesProject =
                !filters.projectId || post.project?.id === filters.projectId;
            return matchesQuery && matchesProject;
        });

        result = [...result].sort((a, b) => {
            const aTime = a.datePosted ? new Date(a.datePosted).getTime() : 0;
            const bTime = b.datePosted ? new Date(b.datePosted).getTime() : 0;
            const diff = aTime - bTime;
            return filters.sortOrder === 'newest' ? -diff : diff;
        });

        return result;
    }, [blogPosts, filters]);

    return (
        <div className="blog-page-container">
            <h1 className="blog-page-heading">Blog</h1>

            <BlogSearchBar
                filters={filters}
                onChange={setFilters}
                projects={filterProjects}
            />

            {filtered.length === 0 ? (
                <p className="blog-page-empty">No posts match your search.</p>
            ) : (
                <ul className="blog-list">
                    {filtered.map((post) => (
                       <BlogPostItem key={post.id} post={post} />
                    ))}
                </ul>
            )}
        </div>
    );
}
