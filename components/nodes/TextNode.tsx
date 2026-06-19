import React from "react";
import { NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { useCanvasStore, type CustomNode } from "@/store/canvasStore";

export const TextNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const title = data.title || "Note";
  const text = data.text || "";

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: e.target.value });
  };

  return (
    <NodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      selected={selected}
      icon={<FileText size={14} className="text-purple-400" />}
    >
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full min-h-[120px] bg-transparent border-none text-neutral-300 text-sm resize-y focus:outline-none focus:ring-0 placeholder-neutral-600 font-sans leading-relaxed"
        placeholder="Type your notes here..."
      />
    </NodeWrapper>
  );
};
