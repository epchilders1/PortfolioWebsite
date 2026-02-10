"use client";

import { useRef, useState } from "react";
import "./HeroImageSelector.css";

interface HeroImageSelectorProps {
    currentImage?: string | null;
    onImageChange: (file: File | null) => void;
}

export default function HeroImageSelector({ currentImage, onImageChange }: HeroImageSelectorProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onImageChange(file);

        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            setPreview(null);
        }
    };

    const displayImage = preview ?? currentImage;

    return (
        <button
            type="button"
            className={`hero-image-selector ${displayImage ? "has-image" : ""}`}
            onClick={() => inputRef.current?.click()}
            style={displayImage ? { backgroundImage: `url(${displayImage})` } : undefined}
        >
            {!displayImage && (
                <div className="hero-image-placeholder">
                    <svg className="hero-image-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                    </svg>
                    <span>Upload Image</span>
                </div>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
            />
        </button>
    );
}
