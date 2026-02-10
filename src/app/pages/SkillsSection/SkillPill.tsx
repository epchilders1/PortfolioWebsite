import './Skills.css';

export interface Skill {
    img: string;
    title: string;
}

export default function SkillPill({ skill }: { skill: Skill }) {
    return (
        <div className="skill-pill">
            <img className="skill-image" src={skill.img} alt={skill.title}/>
            <span className="skill-title">{skill.title}</span>
        </div>
    );
}
