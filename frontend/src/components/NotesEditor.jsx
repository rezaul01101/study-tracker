import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import { useEffect } from "react";

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      className={`tt-btn ${active ? "active" : ""}`}
      title={title}
      // Keep the editor selection while clicking a toolbar button.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function NotesEditor({ initialHtml, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // StarterKit (v3) already bundles bold/italic/headings/lists/blockquote/code/link/undo-redo.
      StarterKit.configure({
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Youtube.configure({ nocookie: true, controls: true, width: 320, height: 180 }),
    ],
    content: initialHtml || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // If the incoming content changes (e.g. a different day is selected), load it without
  // emitting an update (which would trigger an unwanted save).
  useEffect(() => {
    if (!editor) return;
    if ((initialHtml || "") !== editor.getHTML()) {
      editor.commands.setContent(initialHtml || "", { emitUpdate: false });
    }
  }, [initialHtml, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube URL");
    if (url && url.trim()) editor.commands.setYoutubeVideo({ src: url.trim() });
  };

  return (
    <div className="notes-editor">
      <div className="tt-toolbar">
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></ToolbarButton>
        <ToolbarButton title="Heading" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H</ToolbarButton>
        <span className="tt-div" />
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>&ldquo;&rdquo;</ToolbarButton>
        <span className="tt-div" />
        <ToolbarButton title="Add / edit link" active={editor.isActive("link")} onClick={setLink}>Link</ToolbarButton>
        <ToolbarButton title="Embed YouTube video" onClick={addYoutube}>YT</ToolbarButton>
        <span className="tt-spacer" />
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>↺</ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>↻</ToolbarButton>
      </div>
      <EditorContent editor={editor} className="tt-content" />
    </div>
  );
}
