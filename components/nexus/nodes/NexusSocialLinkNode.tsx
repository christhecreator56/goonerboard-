"use client";

import React from "react";
import { NodeProps } from "@xyflow/react";
import { Link2, ExternalLink, Globe } from "lucide-react";
import { NexusNodeWrapper } from "../NexusNodeWrapper";
import { useUpdateNodeData, useDeleteNode } from "@/lib/liveblocks";
import { type CustomNode } from "@/store/canvasStore";

export const NexusSocialLinkNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useUpdateNodeData();
  const deleteNode = useDeleteNode();

  const title = data.title || "LINK EMBED";
  const url = data.url || "";
  const loaded = data.loaded || false;

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const handleUnfurl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Simulate link unfurl parsing
    updateNodeData(id, {
      loaded: true,
      description: "SECURE PLATFORM RESPONSE PROTOCOL LOADED. NODE COMPATIBLE.",
      platform: url.includes("github.com") 
        ? "GITHUB // SOURCE" 
        : url.includes("youtube.com") || url.includes("youtu.be")
          ? "YOUTUBE // MEDIA"
          : "EXTERNAL // DOMAIN",
    });
  };

  return (
    <NexusNodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      onDelete={() => deleteNode(id)}
      selected={selected}
      icon={<Link2 size={14} className="text-[#00ff66]" />}
    >
      <div className="flex flex-col gap-3 font-mono">
        {!loaded ? (
          <form onSubmit={handleUnfurl} className="flex flex-col gap-2">
            <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
              INPUT INSTANCE URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => updateNodeData(id, { url: e.target.value })}
                className="flex-1 bg-neutral-950 border border-neutral-900 rounded-none px-2 py-1.5 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-[#00ff66] transition-colors uppercase"
                placeholder="https://..."
              />
              <button
                type="submit"
                className="px-3 bg-neutral-950 hover:bg-[#00ff66] text-neutral-400 hover:text-black border border-neutral-900 hover:border-[#00ff66] rounded-none text-[10px] font-bold uppercase transition-all cursor-pointer"
              >
                UNFURL
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-2 bg-black border border-neutral-900 p-3">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-2">
              <Globe size={14} className="text-[#00ff66]" />
              <span className="text-[10px] font-bold text-[#00ff66] uppercase tracking-wider">
                {data.platform}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-normal uppercase">
              {data.description}
            </p>
            <div className="text-[9px] text-neutral-600 truncate uppercase mt-1 select-none">
              {url}
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-1.5 border border-neutral-800 hover:border-[#00ff66] text-[10px] font-black uppercase text-center flex items-center justify-center gap-1.5 transition-all text-neutral-300 hover:text-white bg-neutral-950 rounded-none"
            >
              LAUNCH GATEWAY <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
    </NexusNodeWrapper>
  );
};
