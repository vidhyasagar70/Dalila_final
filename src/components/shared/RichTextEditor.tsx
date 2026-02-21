"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  disabled = false,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 200px;
          color: #111827 !important;
          background-color: #ffffff !important;
        }
        .ProseMirror * {
          color: #111827 !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af !important;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
          color: #111827 !important;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 0.875rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
          color: #111827 !important;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          color: #111827 !important;
        }
        .ProseMirror p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #111827 !important;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
        }
        .ProseMirror ol {
          list-style-type: decimal;
        }
        .ProseMirror li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          color: #111827 !important;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #c89e3a;
          padding-left: 1rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
          font-style: italic;
          color: #6b7280 !important;
        }
        .ProseMirror strong {
          font-weight: 700;
          color: #111827 !important;
        }
        .ProseMirror em {
          font-style: italic;
          color: #111827 !important;
        }
      `}</style>
      <div className={`border border-gray-300 rounded-none bg-white ${className}`}>
      {/* Toolbar - Sticky */}
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("bold") ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Bold"
        >
          <Bold size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("italic") ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Italic"
        >
          <Italic size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 1"
        >
          <Heading1 size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 2"
        >
          <Heading2 size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("heading", { level: 3 }) ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Heading 3"
        >
          <Heading3 size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("bulletList") ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Bullet List"
        >
          <List size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("orderedList") ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Numbered List"
        >
          <ListOrdered size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            editor.isActive("blockquote") ? "bg-gray-300 text-gray-900" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Quote"
        >
          <Quote size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            disabled || !editor.can().undo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Undo"
        >
          <Undo size={18} className="text-gray-700" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 ${
            disabled || !editor.can().redo() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Redo"
        >
          <Redo size={18} className="text-gray-700" />
        </button>
      </div>

      {/* Editor Content - Scrollable */}
      <div className="max-h-96 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="prose max-w-none p-4 min-h-[200px] bg-white focus:outline-none text-gray-900"
        />
      </div>
    </div>
    </>
  );
}
