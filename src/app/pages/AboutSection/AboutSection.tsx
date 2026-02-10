"use client";
import './AboutSection.css';
import { useEffect, useRef } from 'react';

export default function AboutSection(){
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

    return(
        <div id="about-section" className="about-container" ref={sectionRef}>
            <h1>About</h1>
            <p>{"Hello! My name is Evan, I am software engineer studying CS and Math at Alabama. I build full-stack applications, work with ML pipelines, and care about writing code that people will use."}</p>
            <p>{"I am currently working on university safety systems as a software developer coop at CAPS and I'm scaling an AI platform for sorority recruitment. I'm drawn to problems that start on a whiteboard and end up in production."}</p>
        </div>
    );
}
