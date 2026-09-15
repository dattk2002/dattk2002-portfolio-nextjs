"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Editor, JSONContent } from "@tiptap/core";
import DragHandle from "@tiptap/extension-drag-handle-react";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  GripVertical,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  UnderlineIcon,
  Undo2,
  Video,
} from "lucide-react";

import { ImageUploadButton } from "@/components/admin/image-upload-button";
import { Button } from "@/components/ui/button";
import type { BlogDocument } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

type NotionEditorProps = {
  value: BlogDocument;
  onChange: (value: BlogDocument) => void;
  label: string;
};

type SlashCommand = {
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  run: (editor: Editor) => void;
};

const slashCommands: SlashCommand[] = [
  { label: "Heading 2", hint: "Large section heading", icon: Heading2, run: (editor) => editor.chain().focus().setHeading({ level: 2 }).run() },
  { label: "Heading 3", hint: "Smaller section heading", icon: Heading3, run: (editor) => editor.chain().focus().setHeading({ level: 3 }).run() },
  { label: "Bullet list", hint: "Create a simple list", icon: List, run: (editor) => editor.chain().focus().toggleBulletList().run() },
  { label: "Numbered list", hint: "Create a sequenced list", icon: ListOrdered, run: (editor) => editor.chain().focus().toggleOrderedList().run() },
  { label: "Task list", hint: "Track a checklist", icon: ListChecks, run: (editor) => editor.chain().focus().toggleTaskList().run() },
  { label: "Quote", hint: "Emphasize a passage", icon: Quote, run: (editor) => editor.chain().focus().toggleBlockquote().run() },
  { label: "Code block", hint: "Add a code sample", icon: Code, run: (editor) => editor.chain().focus().toggleCodeBlock().run() },
  { label: "Divider", hint: "Separate ideas", icon: Minus, run: (editor) => editor.chain().focus().setHorizontalRule().run() },
];

function ToolbarButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-label={label} aria-pressed={active || undefined} className={cn("grid size-11 shrink-0 place-items-center border-r border-border text-muted transition-colors hover:bg-surface-raised hover:text-foreground", active && "bg-surface-raised text-accent")}>{children}</button>;
}

export function NotionEditor({ value, onChange, label }: NotionEditorProps) {
  const [revision, setRevision] = useState(0);
  const [urlMode, setUrlMode] = useState<"link" | "youtube" | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const [slashMenu, setSlashMenu] = useState<{ from: number; query: string; top: number; left: number } | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);
  const slashRef = useRef(slashMenu);
  const slashIndexRef = useRef(0);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    slashRef.current = slashMenu;
  }, [slashMenu]);

  const extensions = useMemo(() => [
    StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false, autolink: true, defaultProtocol: "https" } }),
    Placeholder.configure({ placeholder: "Write your article. Type / for blocks…" }),
    Image.configure({ allowBase64: false, HTMLAttributes: { class: "editor-image" } }),
    Youtube.configure({ nocookie: true, controls: true, allowFullscreen: true, width: 1280, height: 720 }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ], []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: value as JSONContent,
    editorProps: {
      attributes: { class: "notion-editor-content", "aria-label": label },
      handleKeyDown: (_view, event) => {
        const menu = slashRef.current;
        const currentEditor = editorRef.current;
        if (!menu || !currentEditor) return false;
        const commands = slashCommands.filter((command) => command.label.toLowerCase().includes(menu.query));
        if (event.key === "Escape") { setSlashMenu(null); return true; }
        if (event.key === "ArrowDown" && commands.length > 0) { event.preventDefault(); const next = (slashIndexRef.current + 1) % commands.length; slashIndexRef.current = next; setSlashIndex(next); return true; }
        if (event.key === "ArrowUp" && commands.length > 0) { event.preventDefault(); const next = (slashIndexRef.current - 1 + commands.length) % commands.length; slashIndexRef.current = next; setSlashIndex(next); return true; }
        if (event.key === "Enter" && commands.length > 0) { event.preventDefault(); executeSlashCommand(currentEditor, commands[slashIndexRef.current] ?? commands[0], menu); return true; }
        return false;
      },
    },
    onCreate: ({ editor: currentEditor }) => { editorRef.current = currentEditor; },
    onDestroy: () => { editorRef.current = null; },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getJSON() as BlogDocument);
      updateSlashMenu(currentEditor);
      setRevision((current) => current + 1);
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      updateSlashMenu(currentEditor);
      setRevision((current) => current + 1);
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
      editor.commands.setContent(value as JSONContent, { emitUpdate: false });
    }
  }, [editor, value]);

  function updateSlashMenu(currentEditor: Editor) {
    const { $from } = currentEditor.state.selection;
    const before = $from.parent.textBetween(0, $from.parentOffset, undefined, "\ufffc");
    const match = before.match(/^\/([^\s/]*)$/);
    if (!match) { setSlashMenu(null); return; }
    const coordinates = currentEditor.view.coordsAtPos(currentEditor.state.selection.from);
    setSlashMenu({ from: currentEditor.state.selection.from - match[0].length, query: match[1].toLowerCase(), top: coordinates.bottom + 8, left: Math.min(coordinates.left, window.innerWidth - 310) });
    slashIndexRef.current = 0;
    setSlashIndex(0);
  }

  function executeSlashCommand(currentEditor: Editor, command: SlashCommand, menu: NonNullable<typeof slashMenu>) {
    currentEditor.chain().focus().deleteRange({ from: menu.from, to: currentEditor.state.selection.from }).run();
    command.run(currentEditor);
    setSlashMenu(null);
  }

  if (!editor) return <div className="min-h-80 animate-pulse border border-border bg-surface" aria-label="Loading editor" />;

  const filteredCommands = slashCommands.filter((command) => command.label.toLowerCase().includes(slashMenu?.query ?? ""));
  void revision;

  return (
    <div className="relative min-w-0 max-w-full overflow-hidden border border-border bg-background">
      <div className="sticky top-0 z-20 flex w-full max-w-full overflow-x-auto border-b border-border bg-surface/95 backdrop-blur-xl" role="toolbar" aria-label="Article formatting">
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="size-4" /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="size-4" /></ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={() => { setUrlMode("link"); setUrlValue(editor.getAttributes("link").href ?? ""); }}><Link2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
        <ToolbarButton label="Task list" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}><ListChecks className="size-4" /></ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="size-4" /></ToolbarButton>
        <ToolbarButton label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="size-4" /></ToolbarButton>
        <ImageUploadButton label="Image" variant="ghost" className="[&>button]:rounded-none [&>button]:border-r [&>button]:border-border [&>button]:px-4" onUploaded={(url) => { const alt = window.prompt("Describe this image for readers using assistive technology. Leave blank only if it is decorative.") ?? ""; editor.chain().focus().setImage({ src: url, alt }).run(); }} />
        <ToolbarButton label="Embed YouTube" onClick={() => { setUrlMode("youtube"); setUrlValue(""); }}><Video className="size-4" /></ToolbarButton>
      </div>

      {urlMode ? (
        <div className="grid gap-3 border-b border-border bg-surface-raised p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="grid gap-2 text-xs font-medium text-muted"><span>{urlMode === "link" ? "Link URL" : "YouTube URL"}</span><input type="url" value={urlValue} onChange={(event) => setUrlValue(event.target.value)} placeholder={urlMode === "link" ? "https://example.com" : "https://youtube.com/watch?v=…"} className="min-h-11 border border-border bg-background px-3 text-sm text-foreground" autoFocus /></label>
          <Button type="button" onClick={() => { if (urlMode === "link") { if (urlValue) editor.chain().focus().extendMarkRange("link").setLink({ href: urlValue }).run(); else editor.chain().focus().unsetLink().run(); } else if (urlValue) editor.commands.setYoutubeVideo({ src: urlValue, width: 1280, height: 720 }); setUrlMode(null); setUrlValue(""); }}>Insert</Button>
          <Button type="button" variant="ghost" onClick={() => setUrlMode(null)}>Cancel</Button>
        </div>
      ) : null}

      <div className="relative px-5 py-8 sm:px-12 sm:py-12">
        <DragHandle editor={editor}><span className="grid size-8 cursor-grab place-items-center border border-border bg-surface text-faint" aria-hidden="true"><GripVertical className="size-4" /></span></DragHandle>
        <EditorContent editor={editor} />
      </div>

      {slashMenu && filteredCommands.length > 0 ? (
        <div className="fixed z-[80] w-72 border border-border bg-surface-raised p-2 shadow-2xl" style={{ top: slashMenu.top, left: Math.max(12, slashMenu.left) }} role="listbox" aria-label="Insert a block">
          {filteredCommands.map((command, index) => { const Icon = command.icon; return <button key={command.label} type="button" role="option" aria-selected={index === slashIndex} onMouseDown={(event) => { event.preventDefault(); executeSlashCommand(editor, command, slashMenu); }} className={cn("flex min-h-12 w-full items-center gap-3 px-3 text-left", index === slashIndex ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-background")}><Icon className="size-4 shrink-0" /><span><span className="block text-sm font-medium">{command.label}</span><span className={cn("block text-xs", index === slashIndex ? "text-accent-foreground/65" : "text-faint")}>{command.hint}</span></span></button>; })}
        </div>
      ) : null}
    </div>
  );
}
