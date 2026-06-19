"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";

interface NexusNodeWrapperProps {
  id: string;
  title: string;
  onTitleChange: (newTitle: string) => void;
  onDelete: () => void;
  children: React.ReactNode;
  selected?: boolean;
  icon?: React.ReactNode;
}

export const NexusNodeWrapper: React.FC<NexusNodeWrapperProps> = ({
  id,
  title,
  onTitleChange,
  onDelete,
  children,
  selected,
  icon,
}) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const serverId = segments[1] || "nexus-prime";

  // Accent logic based on the active server
  const isRed = serverId === "nexus-prime";
  const borderSelectedClass = isRed
    ? "border-[#ff0033] shadow-[0_0_15px_rgba(255,0,51,0.2)]"
    : "border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]";

  return (
    <div
      className={`relative flex flex-col min-w-[280px] bg-[#030303] border-2 rounded-none overflow-hidden shadow-2xl transition-all duration-150 group ${
        selected ? borderSelectedClass : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      {/* React Flow Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3.5 h-3.5 !bg-[#00ff66] !border-2 !border-black !rounded-none -left-[8px] hover:scale-110 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3.5 h-3.5 !bg-[#ff0033] !border-2 !border-black !rounded-none -right-[8px] hover:scale-110 transition-transform"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-neutral-900 drag-handle cursor-grab active:cursor-grabbing select-none rounded-none">
        <div className="flex items-center gap-2 flex-1 mr-2 min-w-0">
          {icon && <div className="text-neutral-500 shrink-0">{icon}</div>}
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent border-none text-neutral-100 font-bold text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded-none px-1 w-full"
            placeholder="Untitled Node"
          />
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-[#ff0033] hover:bg-neutral-900 rounded-none transition-all cursor-pointer shrink-0"
          title="Delete Node"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col gap-3 text-neutral-300 rounded-none">
        {children}
      </div>
    </div>
  );
};
