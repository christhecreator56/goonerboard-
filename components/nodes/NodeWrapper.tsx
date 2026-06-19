import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";

interface NodeWrapperProps {
  id: string;
  title: string;
  onTitleChange: (newTitle: string) => void;
  children: React.ReactNode;
  selected?: boolean;
  icon?: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  id,
  title,
  onTitleChange,
  children,
  selected,
  icon,
}) => {
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  return (
    <div
      className={`relative flex flex-col min-w-[280px] bg-neutral-950 border-2 rounded-xl overflow-hidden shadow-2xl transition-all duration-200 group ${
        selected
          ? "border-purple-500 ring-2 ring-purple-500/20 shadow-purple-500/10"
          : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-neutral-950 !rounded-full -left-[7px] hover:scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500 !border-2 !border-neutral-950 !rounded-full -right-[7px] hover:scale-125 transition-transform"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/60 border-b border-neutral-900 drag-handle cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-2 flex-1 mr-2 min-w-0">
          {icon && <div className="text-neutral-500 shrink-0">{icon}</div>}
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent border-none text-neutral-100 font-semibold text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 rounded px-1 w-full"
            placeholder="Untitled Node"
          />
        </div>
        <button
          onClick={() => deleteNode(id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-all cursor-pointer shrink-0"
          title="Delete Node"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3 text-neutral-300">
        {children}
      </div>
    </div>
  );
};
