import './ContactSection.css';

export default function ContactSection() {
    return(
        <section id="contact-section" className="contact-section">
            <div className="contact-container">
                <h1>Let's Connect</h1>
                <h2>{"Let's build something together."}</h2>
                <p>{"I'd love to hear from you! If you have any questions about my resume, ideas for a project or just want to chat, please reach out!"}</p>
                <a href="mailto:echilders2004@gmail.com" className="contact-btn">
                    Get in Touch
                </a>
            </div>
        </section>
    );
}
