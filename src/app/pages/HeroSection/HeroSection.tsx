"use client";
import './HeroSection.css';
import LightPillar from './LightPillar';
import EvanGlacier from './assets/evan_glacier.jpg'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import Navbar from '../../_components/Navbar/Navbar';
import RotatingText from './RotatingText'

interface HeroProps{
}

export default function HeroSection(props:HeroProps){


    return(
        <div className="hero-container">
            <LightPillar
                topColor="#5227FF"
                bottomColor="#FF9FFC"
                intensity={0.8}
                rotationSpeed={0.6}
                glowAmount={0.004}
                pillarWidth={4}
                pillarHeight={0.4}
                noiseIntensity={1}
                pillarRotation={40}
                interactive={false}
                mixBlendMode="screen"
                quality="medium"
            />
            <div className="hero-content">
                <div className="info">
                    <h1 className="name ">
                        Evan Childers
                    </h1>
                    <div className="role">
                    <RotatingText
                        texts={['Software Developer', 'Full-Stack Engineer', 'Data Scientist', 'Tech Enthusiast']}
                        mainClassName="font-bold overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 20, stiffness: 400 }}
                        rotationInterval={4000}
                        />
                        </div>
                    <p className="description">
                        CS + Math @ The University of Alabama.
                    </p>
                    
                    <div className="status-items">
                        <div className="status-item">
                            <span className="status-dot"></span>
                            <span>Software Developer Co-op @ The Center for Advanced Public Safety</span>
                        </div>
                        <div className="status-item">
                            <span className="status-dot status-dot-secondary"></span>
                            <span>Founder & CEO @ SolSistr</span>
                        </div>
                    </div>

                    <div className="cta-buttons">
                        <a className="btn btn-primary" href="/resume.pdf" target="_blank" rel="noopener noreferrer">View Resume</a>
                        <a className="btn btn-secondary" href="mailto:echilders2004@gmail.com">Get in Touch</a>
                    </div>
{/* 
                    <div className="social-links">
                        <a href="https://linkedin.com/in/epchilders1" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/epchilders1" target="_blank" rel="noopener noreferrer">
                            <FaGithub />
                        </a>
                        <a href="mailto:echilders2004@gmail.com">
                            <FaEnvelope />
                        </a>
                    </div> */}
                </div>

                <div className="profile-picture-container">
                    <div className="image-wrapper">
                        <img className="profile-picture" src={EvanGlacier.src} alt="Evan Childers"/>
                    </div>
                </div>
            </div>
            
            <div className="scroll-indicator">
                <span>SCROLL</span>
                <div className="scroll-arrow">↓</div>
            </div>
        </div>
    );
}