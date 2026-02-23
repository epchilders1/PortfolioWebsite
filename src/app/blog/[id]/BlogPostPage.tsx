import Markdown from 'react-markdown';
import './BlogPostPage.css';
import type { BlogPost } from '~/app/types';
import { Clock } from 'lucide-react';

interface BlogPostPageProps{
    post: BlogPost;
}


export default function BlogPostPage(props: BlogPostPageProps){
    const { post } = props;

    return(
        <div className="blog-post-container">
            <h1>{post.headline}</h1>
                {post.readTimeMinutes && (
                    <span className="blog-card-meta-item">
                        <Clock size={13} />
                        {post.readTimeMinutes} min read
                    </span>
                )}
            <div className="blog-post-content">
                <Markdown>{post.markDownContent}</Markdown>
            </div>
        </div>
    );
}