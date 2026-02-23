import './Button.css';

interface ButtonLinkProps {
    text: string;
    link: string;
    className?: string;
}

export default function ButtonLink(props: ButtonLinkProps) {
    const { text, link, className } = props;
    return (
        <a href={link} className={`btn-link ${className ?? ''}`}>
            {text}
        </a>
    );
}