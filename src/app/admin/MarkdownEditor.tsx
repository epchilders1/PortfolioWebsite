"use client";

import "@mdxeditor/editor/style.css";
import { useState, useEffect } from "react";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    imagePlugin,
    diffSourcePlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    UndoRedo,
    BlockTypeSelect,
    CreateLink,
    ListsToggle,
    InsertThematicBreak,
    InsertImage,
    Separator,
    DiffSourceToggleWrapper,
} from "@mdxeditor/editor";

export interface MarkdownEditorProps {
    markdown: string;
    onChange: (value: string) => void;
    imageUploadHandler?: (file: File) => Promise<string>;
}

export default function MarkdownEditor({ markdown, onChange, imageUploadHandler }: MarkdownEditorProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <div style={{ minHeight: 420 }} />;

    return (
        <MDXEditor
            className="bm-mdx-editor"
            contentEditableClassName="bm-mdx-content"
            markdown={markdown}
            onChange={onChange}
            plugins={[
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <ListsToggle />
                            <Separator />
                            <CreateLink />
                            <InsertThematicBreak />
                            {imageUploadHandler && <InsertImage />}
                        </DiffSourceToggleWrapper>
                    ),
                }),
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        "": "Plain Text",
                        text: "Plain Text",
                        ts: "TypeScript",
                        tsx: "TSX",
                        js: "JavaScript",
                        jsx: "JSX",
                        css: "CSS",
                        html: "HTML",
                        python: "Python",
                        py: "Python",
                        bash: "Bash",
                        sh: "Shell",
                        json: "JSON",
                        sql: "SQL",
                    },
                }),
                imagePlugin({
                    imageUploadHandler: imageUploadHandler ?? (() => Promise.reject(new Error("No upload handler"))),
                }),
                diffSourcePlugin({ viewMode: "rich-text" }),
                markdownShortcutPlugin(),
            ]}
        />
    );
}
