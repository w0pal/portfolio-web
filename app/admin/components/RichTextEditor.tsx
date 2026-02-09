'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import { Bold, Italic, Code, List, ListOrdered, Quote, Heading1, Heading2, Image as ImageIcon } from 'lucide-react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export default function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
    ],
    content: content,
    editable: editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  // Update content if it changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
       // Only update if content is significantly different to avoid cursor jumps
       // But for initial load it's fine.
       // editor.commands.setContent(content);
       // Actually, dealing with external updates in Tiptap is tricky.
       // We'll rely on initial content for now.
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
      {editable && (
        <div className="border-b border-gray-200 dark:border-slate-700 p-2 bg-gray-50 dark:bg-slate-800 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Bold"
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Heading 1"
          >
            <Heading1 size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Heading 2"
          >
            <Heading2 size={18} />
          </button>
           <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Bullet List"
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Ordered List"
          >
            <ListOrdered size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Code Block"
          >
            <Code size={18} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-slate-700 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}
            title="Quote"
          >
            <Quote size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = window.prompt('Enter image URL');
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300`}
            title="Insert Image"
          >
            <ImageIcon size={18} />
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
