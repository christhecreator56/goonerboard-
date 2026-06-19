"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { FileText } from "lucide-react";
import { NexusNodeWrapper } from "../NexusNodeWrapper";
import { useUpdateNodeData, useDeleteNode } from "@/lib/liveblocks";
import { type CustomNode } from "@/store/canvasStore";

export const NexusTextNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useUpdateNodeData();
  const deleteNode = useDeleteNode();

  const title = data.title || "TEXT NOTE";
  const text = data.text || "";

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: e.target.value });
  };

  return (
    <NexusNodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      onDelete={() => deleteNode(id)}
      selected={selected}
      icon={<FileText size={14} className="text-[#00ff66]" />}
    >
      <textarea
        value={text}
        onChange={handleTextChange}
        className="w-full min-h-[110px] bg-transparent border-none text-neutral-300 text-xs resize-y focus:outline-none focus:ring-0 placeholder-neutral-700 font-mono leading-relaxed uppercase rounded-none"
        placeholder="ENTER DATA STREAM CONTENT..."
      />
    </NexusNodeWrapper>
  );
};
