export interface BlogPost{
    id: string
    headline: string
    markDownContent: string
    heroImage?: string | null
    datePosted?: string
    readTimeMinutes?: number | null
    hidden: boolean
    project?: Project
}


export interface Project{
    id:         string
    name:        string
    heroImage:   string
    description: string
    gitHubURL:   string | null
    hostedURL:   string | null
    hidden: boolean
    blogPosts?: BlogPost[]
    tags: string[]
    precedence: number
}

export enum FileTypes{
    ProjectHeros = "project-heros",
    BlogPostHeros = "blog-heros",
    BlogPostImages = "blog-post-images",
}

