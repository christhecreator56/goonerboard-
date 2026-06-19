"use client";

import React, { useState, useRef, useEffect } from "react";
import { NodeProps } from "@xyflow/react";
import {
  FileText,
  Save,
  X,
  Bold,
  Italic,
  Underline,
  List,
  Heading1,
  Heading2,
  Maximize2,
  Calendar,
  Sparkles
} from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { useCanvasStore, type CustomNode } from "@/store/canvasStore";

export const DocNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const title = data.title || "Untitled Document";
  const content = data.content || "<p>Start typing your document content here...</p>";
  const lastSaved = data.lastSaved || "Never";

  // Calculate statistics from HTML content
  const getTextContent = (html: string) => {
    if (typeof window === "undefined") return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const plainText = getTextContent(content);
  const charCount = plainText.length;
  const wordCount = plainText.trim() === "" ? 0 : plainText.trim().split(/\s+/).length;

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  // Format helper inside contentEditable
  const formatText = (command: string, value: string = "") => {
    if (typeof document !== "undefined") {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  };

  const handleSave = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      updateNodeData(id, {
        content: htmlContent,
        lastSaved: now,
      });
      setIsEditing(false);
    }
  };

  // Focus editor when modal opens
  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = content;
      editorRef.current.focus();
    }
  }, [isEditing]);

  return (
    <>
      <NodeWrapper
        id={id}
        title={title}
        onTitleChange={handleTitleChange}
        selected={selected}
        icon={<FileText size={14} className="text-purple-400" />}
      >
        <div className="flex flex-col gap-3 min-w-[260px] select-none">
          {/* Document statistics & snippet */}
          <div className="flex flex-col gap-1.5 p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-lg">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-semibold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Calendar size={10} /> Saved: {lastSaved}
              </span>
              <span>{wordCount} words</span>
            </div>
            <div
              className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mt-1 overflow-hidden"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Open Document Editor Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 hover:border-purple-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Maximize2 size={12} />
            Open Document
          </button>
        </div>
      </NodeWrapper>

      {/* Floating Rich-Text Editor Space (Modal Overlay) */}
      {isEditing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 nodrag nopan">
          <div 
            className="w-full max-w-2xl h-[550px] bg-neutral-950 border-2 border-neutral-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
              <div className="flex items-center gap-3 flex-1 mr-4">
                <FileText size={18} className="text-purple-500" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="bg-transparent border-none text-neutral-100 font-bold text-base focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded px-2 py-1 w-full"
                  placeholder="Document Title"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-600/20"
                >
                  <Save size={12} />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-all cursor-pointer"
                  title="Close without saving"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Word Formatting Toolbar */}
            <div className="flex items-center gap-1.5 px-6 py-2 bg-neutral-900/60 border-b border-neutral-800 select-none">
              <button
                onClick={() => formatText("bold")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Bold"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={() => formatText("italic")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Italic"
              >
                <Italic size={14} />
              </button>
              <button
                onClick={() => formatText("underline")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Underline"
              >
                <Underline size={14} />
              </button>
              <div className="w-[1px] h-4 bg-neutral-800 mx-1" />
              <button
                onClick={() => formatText("insertUnorderedList")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "H1")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Heading 1"
              >
                <Heading1 size={14} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "H2")}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                title="Heading 2"
              >
                <Heading2 size={14} />
              </button>
              <button
                onClick={() => formatText("formatBlock", "P")}
                className="px-2 py-1 text-[10px] text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer font-bold uppercase"
                title="Normal Text"
              >
                Paragraph
              </button>
            </div>

            {/* Editable Content Workspace */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="flex-1 p-6 text-sm text-neutral-200 focus:outline-none overflow-y-auto custom-scrollbar prose prose-invert max-w-none bg-neutral-950"
              style={{
                outline: "none",
                minHeight: "100%",
              }}
            />

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-6 py-3 bg-neutral-900 border-t border-neutral-800 text-[10px] text-neutral-500 font-semibold select-none">
              <span className="flex items-center gap-1 text-purple-400">
                <Sparkles size={10} /> Word-compatible Editor
              </span>
              <div className="flex gap-4">
                <span>{charCount} characters</span>
                <span>{wordCount} words</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
