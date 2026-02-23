"use client";
import React, { useState, useEffect } from "react";
import './Navbar.css';
import { useRouter, usePathname } from 'next/navigation';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram } from 'react-icons/fa';

const SCROLL_TARGET_KEY = 'navbar-scroll-target';

interface NavbarProps{
  isAdmin: boolean
}

export default function Navbar(props:NavbarProps){
  const {isAdmin} = props
  const pathname = usePathname();

  const elementMap = {
    about: "about-section",
    skills: "skills-section",
    projects: "projects-section",
    contact: "contact-section"
  }

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        });
    }
  };

  const handleNavClick = (elementId: string) => {
    if (pathname === '/') {
      smoothScrollTo(elementId);
    } else {
      sessionStorage.setItem(SCROLL_TARGET_KEY, elementId);
      router.push('/');
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
          setScrolled(window.scrollY > 50);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => {
          window.removeEventListener("scroll", handleScroll);
      };
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      const target = sessionStorage.getItem(SCROLL_TARGET_KEY);
      if (target) {
        sessionStorage.removeItem(SCROLL_TARGET_KEY);
        requestAnimationFrame(() => smoothScrollTo(target));
      }
    }
  }, [pathname]);

  const router = useRouter();
  return(
    <>
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-content">
          <div className="nav-links">
            {(Object.keys(elementMap) as Array<keyof typeof elementMap>).map((item) => (
              <button
                key={item}
                onClick={() => handleNavClick(elementMap[item])}
                className="nav-button"
              >
                {item.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
            <button
              key="blog"
              onClick={() => router.push("/blog")}
              className="nav-button"
            >
              Blog
            </button>
            {isAdmin && (
              <button
                key="admin"
                onClick={() => router.push("/admin")}
                className="nav-button"
              >
                Admin
              </button>
            )}
          </div>
            {isAdmin && (
            <button 
            className="nav-brand"
            onClick={()=>router.push("/")}
            >
              <p>Home</p>
          </button>
          )}
        </div>
      </div>
    </nav>

     <div className="nav-social-links">
          <div className="vertical-bar"/>
          <a href="https://linkedin.com/in/epchilders1" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
          </a>
          <a href="https://github.com/epchilders1" target="_blank" rel="noopener noreferrer">
              <FaGithub />
          </a>
          <a href="https://www.instagram.com/childers.evan/" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
          </a>
          <a href="mailto:echilders2004@gmail.com">
              <FaEnvelope />
          </a>
          <div className="vertical-bar"/>
      </div>
      </>
  );
}