"use client";

import './BlogSearchBar.css';
import { Search } from 'lucide-react';

export interface BlogFilters {
    query: string;
    sortOrder: 'newest' | 'oldest';
    projectId: string | null;
}

interface BlogSearchBarProps {
    filters: BlogFilters;
    onChange: (filters: BlogFilters) => void;
    projects: { id: string; name: string }[];
}

export default function BlogSearchBar({ filters, onChange, projects }: BlogSearchBarProps) {
    return (
        <div className="bsb-container">
            <div className="bsb-search-wrapper">
                <Search className="bsb-search-icon" size={16} />
                <input
                    className="bsb-search-input"
                    type="text"
                    placeholder="Search posts..."
                    value={filters.query}
                    onChange={(e) => onChange({ ...filters, query: e.target.value })}
                />
            </div>

            <div className="bsb-filters">
                <select
                    className="bsb-select"
                    value={filters.sortOrder}
                    onChange={(e) =>
                        onChange({ ...filters, sortOrder: e.target.value as 'newest' | 'oldest' })
                    }
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>

                <select
                    className="bsb-select"
                    value={filters.projectId ?? ''}
                    onChange={(e) =>
                        onChange({ ...filters, projectId: e.target.value || null })
                    }
                >
                    <option value="">All Projects</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
