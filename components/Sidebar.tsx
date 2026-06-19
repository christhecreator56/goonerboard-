import React from "react";
import { FileText, CheckSquare, Grid, Link2, Trash2, Lightbulb, Notebook } from "lucide-react";
import { useCanvasStore } from "@/store/canvasStore";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Sidebar: React.FC = () => {
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const nodeTypesList = [
    {
      type: "textNode",
      label: "Text Note",
      description: "Rich text markdown note",
      icon: FileText,
      color: "text-purple-400 group-hover:bg-purple-500/10",
    },
    {
      type: "docNode",
      label: "Doc Editor",
      description: "Embedded rich document",
      icon: Notebook,
      color: "text-purple-400 group-hover:bg-purple-500/10",
    },
    {
      type: "todoNode",
      label: "Todo List",
      description: "Streak checklist tracker",
      icon: CheckSquare,
      color: "text-purple-400 group-hover:bg-purple-500/10",
    },
    {
      type: "tableNode",
      label: "Data Grid",
      description: "Mini css-grid spreadsheet",
      icon: Grid,
      color: "text-purple-400 group-hover:bg-purple-500/10",
    },
    {
      type: "socialLinkNode",
      label: "Social Embed",
      description: "Platform unfurl card preview",
      icon: Link2,
      color: "text-purple-400 group-hover:bg-purple-500/10",
    },
  ];

  return (
    <aside className="w-80 h-full bg-neutral-950/95 border-r border-neutral-800 flex flex-col p-5 select-none z-10">
      {/* Title / Logo */}
      <div className="flex flex-col gap-1 pb-6 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black bg-gradient-to-r from-purple-500 to-indigo-400 bg-clip-text text-transparent tracking-tighter">
            GOONBOARD
          </span>
          <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
            v1.0
          </span>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          Spatial productivity goon cave for sigmas. Zero-lag mind mapping.
        </p>
      </div>

      {/* Draggable Blocks Section */}
      <div className="flex-1 flex flex-col gap-4 py-6">
        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          Draggable Blocks
        </div>
        <div className="flex flex-col gap-2.5">
          {nodeTypesList.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="group flex items-center gap-3.5 p-3.5 bg-neutral-900 border border-neutral-800 hover:border-purple-500/60 hover:bg-neutral-900/60 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200"
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
              >
                <div className={`p-2 bg-neutral-950 border border-neutral-800 group-hover:border-purple-500/30 rounded-lg transition-colors ${node.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-bold text-neutral-200 group-hover:text-white transition-colors">
                    {node.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate">
                    {node.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drag Helper Tip */}
        <div className="mt-4 p-3 bg-neutral-900/40 border border-neutral-800/60 rounded-lg text-[10px] text-neutral-500 leading-normal flex items-start gap-1.5 select-none">
          <Lightbulb size={12} className="text-purple-400 shrink-0 mt-0.5" />
          <span>
            <span className="font-semibold text-neutral-400">Pro Tip:</span> Drag any block type onto the infinite canvas to create notes, documents, checklists, trackers or quick links.
          </span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
        <button
          onClick={clearCanvas}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-neutral-900 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-950 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none"
        >
          <Trash2 size={14} />
          Clear Workspace
        </button>

        <div className="flex items-center justify-between text-[10px] text-neutral-600">
          <span>Keyboard: Drag + Connect</span>
          <a
            href="https://github.com/xyflow/xyflow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-400 flex items-center gap-1"
          >
            <GithubIcon className="w-2.5 h-2.5" />
            React Flow
          </a>
        </div>
      </div>
    </aside>
  );
};
