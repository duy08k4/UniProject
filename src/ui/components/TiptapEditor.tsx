import type React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import { useEffect } from "react"

const MAX_CHARS = 2000

type Props = {
    content?: string       // JSON string
    onChange?: (json: string) => void
    readonly?: boolean
}

const TiptapEditor: React.FC<Props> = ({ content, onChange, readonly = false }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: content ? JSON.parse(content) : '',
        editable: !readonly,
        onUpdate: ({ editor }) => {
            if (!onChange) return
            const text = editor.getText()
            if (text.length > MAX_CHARS) {
                editor.commands.undo()
                return
            }
            onChange(JSON.stringify(editor.getJSON()))
        },
    })

    useEffect(() => {
        if (!editor || !content || editor.isFocused) return
        const current = JSON.stringify(editor.getJSON())
        if (current !== content) editor.commands.setContent(JSON.parse(content))
    }, [content])

    const charCount = editor?.getText().length ?? 0

    const btn = (action: () => boolean, active: boolean, label: string) => (
        <button type="button" onMouseDown={e => { e.preventDefault(); action() }}
            className={`px-2 py-1 rounded text-smallSize font-medium transition-colors ${active ? "bg-mainColor text-white" : "hover:bg-gray/10 dark:text-white"}`}>
            {label}
        </button>
    )

    return (
        <div className={`${readonly ? "border-none" : "border border-gray/30 rounded-md overflow-hidden dark:bg-dark"}`}>
            {!readonly && editor && (
                <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-gray/20 bg-gray/5 dark:bg-white/5">
                    {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'B')}
                    {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'I')}
                    {btn(() => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'U')}
                </div>
            )}

            <EditorContent editor={editor}
                className={`px-4 py-3 focus:outline-none min-h-[120px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror_*]:text-[#3e3f46] [&_.ProseMirror_*]:dark:text-white ${readonly ? "cursor-default" : ""}`} />

            {!readonly && (
                <div className={`px-3 py-1 text-tinySize text-right border-t border-gray/10 ${charCount > MAX_CHARS * 0.9 ? "text-red" : "text-gray"}`}>
                    {charCount}/{MAX_CHARS}
                </div>
            )}
        </div>
    )
}

export default TiptapEditor
