"use client";

import React, { useState, useRef, useMemo } from "react";
import { NodeProps } from "@xyflow/react";
import { Notebook, FileText, Check, Plus, Edit3, X, Bold, Italic, Underline, List, Heading1, Heading2 } from "lucide-react";
import { NexusNodeWrapper } from "../NexusNodeWrapper";
import { useCanvasStore, type CustomNode } from "@/store/canvasStore";

export const NexusDocNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  const title = data.title || "Untitled Document";
  const content = data.content || "<h1>Start typing here...</h1>";
  const lastSaved = data.lastSaved || "Never";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState(title);
  const editorRef = useRef<HTMLDivElement>(null);

  // Derived stats from content prop (no effects, safe from cascading renders)
  const cardStats = useMemo(() => {
    if (typeof window === "undefined") {
      return { wordCount: 0, snippetText: "" };
    }
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return {
      wordCount: text.trim() === "" ? 0 : text.trim().split(/\s+/).length,
      snippetText: text.slice(0, 160) + (text.length > 160 ? "..." : ""),
    };
  }, [content]);

  // Modal active editor statistics
  const [editorWordCount, setEditorWordCount] = useState(0);
  const [editorCharCount, setEditorCharCount] = useState(0);

  const calculateEditorStats = (html: string) => {
    if (typeof window === "undefined") return;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    setEditorCharCount(text.length);
    setEditorWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
  };

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
    setModalTitle(newTitle);
  };

  const handleOpenEditor = () => {
    setModalTitle(title);
    calculateEditorStats(content);
    setIsModalOpen(true);
  };

  const handleSaveDocument = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      updateNodeData(id, {
        title: modalTitle,
        content: newContent,
        lastSaved: now,
      });
    }
    setIsModalOpen(false);
  };

  // Browser format exec commands
  const formatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  return (
    <>
      <NexusNodeWrapper
        id={id}
        title={title}
        onTitleChange={handleTitleChange}
        onDelete={() => deleteNode(id)}
        selected={selected}
        icon={<Notebook size={14} className="text-[#00ff66]" />}
      >
        <div className="flex flex-col gap-3 font-mono">
          <div className="bg-neutral-950 border border-neutral-900 p-3 flex flex-col gap-2 rounded-none">
            <p className="text-[10px] text-neutral-400 leading-relaxed max-h-16 overflow-hidden uppercase line-clamp-3 select-none">
              {cardStats.snippetText || "NO CONTENTS YET. INITIALIZE STREAM FEED."}
            </p>
            <div className="border-t border-neutral-900 pt-2 flex items-center justify-between text-[9px] text-neutral-500 font-bold select-none">
              <span>WORDS: {cardStats.wordCount}</span>
              <span>SAVED: {lastSaved}</span>
            </div>
          </div>
          <button
            onClick={handleOpenEditor}
            className="w-full py-2 bg-neutral-950 hover:bg-[#00ff66] text-[#00ff66] hover:text-black border border-neutral-900 hover:border-[#00ff66] text-xs font-bold uppercase transition-all duration-150 cursor-pointer rounded-none flex items-center justify-center gap-1.5"
          >
            <Edit3 size={12} />
            Edit Document
          </button>
        </div>
      </NexusNodeWrapper>

      {/* Brutalist Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/85 flex items-center justify-center p-4 font-mono select-none">
          <div className="w-full max-w-4xl bg-[#000000] border-2 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.15)] flex flex-col h-[80vh] rounded-none">
            {/* Modal Header */}
            <div className="h-14 border-b border-neutral-900 bg-[#0a0a0a] px-6 flex items-center justify-between rounded-none">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <Notebook size={16} className="text-[#00ff66]" />
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  className="bg-transparent border-none text-sm font-black text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#00ff66]/40 px-2.5 py-1 w-full rounded-none"
                  placeholder="Rename Document..."
                />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-500 hover:text-[#ff0033] hover:bg-neutral-900 transition-all rounded-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Rich Text Toolbar */}
            <div className="px-4 py-2 bg-neutral-950 border-b border-neutral-900 flex flex-wrap gap-1 items-center select-none rounded-none">
              <button
                onClick={() => formatText("bold")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer"
                title="Bold"
              >
                <Bold size={13} />
              </button>
              <button
                onClick={() => formatText("italic")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer"
                title="Italic"
              >
                <Italic size={13} />
              </button>
              <button
                onClick={() => formatText("underline")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer"
                title="Underline"
              >
                <Underline size={13} />
              </button>
              <div className="w-[1px] h-6 bg-neutral-900 mx-1.5" />
              <button
                onClick={() => formatText("insertUnorderedList")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer"
                title="Bullet List"
              >
                <List size={13} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "<h1>")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer text-[10px] font-bold"
                title="Heading 1"
              >
                <Heading1 size={13} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "<h2>")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer text-[10px] font-bold"
                title="Heading 2"
              >
                <Heading2 size={13} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "<p>")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded-none transition-all cursor-pointer text-[9px] font-bold uppercase tracking-widest"
                title="Paragraph"
              >
                P
              </button>
            </div>

            {/* Editable Content Workspace */}
            <div className="flex-1 p-8 overflow-y-auto bg-black border-none select-text focus:outline-none">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: content }}
                className="prose prose-invert max-w-none text-neutral-200 text-sm focus:outline-none font-mono min-h-full leading-relaxed uppercase"
                onInput={(e) => calculateEditorStats((e.target as HTMLDivElement).innerHTML)}
              />
            </div>

            {/* Modal Footer / Stats */}
            <div className="h-12 border-t border-neutral-900 bg-neutral-950 px-6 flex items-center justify-between text-[10px] text-neutral-500 font-bold rounded-none">
              <div className="flex gap-4">
                <span>WORDS: {editorWordCount}</span>
                <span>CHARACTERS: {editorCharCount}</span>
              </div>
              <button
                onClick={handleSaveDocument}
                className="px-5 py-2 bg-[#00ff66] hover:bg-[#00ff66]/90 text-black border border-[#00ff66] font-black uppercase text-[10px] transition-all cursor-pointer rounded-none flex items-center gap-1.5"
              >
                <Check size={12} />
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
