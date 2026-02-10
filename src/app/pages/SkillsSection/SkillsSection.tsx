import './Skills.css';
import SkillPill, { type Skill } from './SkillPill';

interface SkillCategory {
    label: string;
    skills: Skill[];
}

const categories: SkillCategory[] = [
    {
        label: "Languages",
        skills: [
            { img: "./icons/python.svg", title: "Python" },
            { img: "./icons/typescript.svg", title: "Typescript" },
            { img: "./icons/javascript.svg", title: "Javascript" },
            { img: "./icons/cs.svg", title: "C#" },
            { img: "./icons/java.svg", title: "Java" },
            { img: "./icons/c.svg", title: "C" },
            { img: "./icons/cpp.svg", title: "C++" },
            { img: "./icons/html.svg", title: "HTML5" },
        ],
    },
    {
        label: "Frameworks & Libraries",
        skills: [
            { img: "./icons/react.svg", title: "React" },
            { img: "./icons/next.svg", title: "Next.js" },
            { img: "./icons/node.svg", title: "Node.js" },
            { img: "./icons/express.svg", title: "Express.js" },
            { img: "./icons/dotnet.svg", title: ".NET" },
            { img: "./icons/flask.svg", title: "Flask" },
            { img: "./icons/tailwind.svg", title: "TailwindCSS" },
            { img: "./icons/trpc.png", title: "tRPC" },
        ],
    },
    {
        label: "Data & ML",
        skills: [
            { img: "./icons/scikit.svg", title: "Scikit-Learn" },
            { img: "./icons/pandas.png", title: "Pandas" },
            { img: "./icons/postgresql.svg", title: "PostgreSQL" },
            { img: "./icons/redis.svg", title: "Redis" },
            { img: "./icons/prisma.svg", title: "Prisma" },
        ],
    },
    {
        label: "Tools & Infrastructure",
        skills: [
            { img: "./icons/docker.svg", title: "Docker" },
            { img: "./icons/aws.svg", title: "AWS Ecosystem" },
            { img: "./icons/vercel.svg", title: "Vercel" },
            { img: "./icons/heroku.svg", title: "Heroku" },
            { img: "./icons/azure.svg", title: "Azure Devops" },
            { img: "./icons/git.svg", title: "Git" },
            { img: "./icons/raspberrypi.svg", title: "Raspberry Pi" },
            { img: "./icons/figma.svg", title: "Figma" },
        ],
    },
];

export default function SkillsSection() {
    return (
        <div id="skills-section" className="skill-container">
            <h1>Skills</h1>
            <div className="skill-categories">
                {categories.map((category, i) => (
                    <div key={i} className="skill-category">
                        <h2 className="category-label">{category.label}</h2>
                        <div className="skills-grid">
                            {category.skills.map((skill, j) => (
                                <SkillPill key={j} skill={skill} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
