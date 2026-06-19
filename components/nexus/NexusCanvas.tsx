"use client";

import React, { useRef, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  useReactFlow,
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "next/navigation";
import { type CustomNode, type CanvasNodeData } from "@/store/canvasStore";
import {
  useUpdateMyPresence,
  useStorage,
  useMutation,
  type Storage,
} from "@/lib/liveblocks";


// ─── Node components ──────────────────────────────────────────────────────────
import { NexusTextNode }       from "./nodes/NexusTextNode";
import { NexusTodoNode }       from "./nodes/NexusTodoNode";
import { NexusTableNode }      from "./nodes/NexusTableNode";
import { NexusSocialLinkNode } from "./nodes/NexusSocialLinkNode";
import { NexusDocNode }        from "./nodes/NexusDocNode";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  Plus,
  Minus,
  Maximize2,
  FileText,
  Notebook,
  CheckSquare,
  Grid,
  Link2,
  Trash2,
  HelpCircle,
} from "lucide-react";

// Register node types for ReactFlow
const nodeTypes = {
  textNode:       NexusTextNode,
  todoNode:       NexusTodoNode,
  tableNode:      NexusTableNode,
  socialLinkNode: NexusSocialLinkNode,
  docNode:        NexusDocNode,
};

const nodeTypesList = [
  {
    type: "textNode",
    label: "Text Note",
    description: "Markdown text notepad",
    icon: FileText,
  },
  {
    type: "docNode",
    label: "Doc Editor",
    description: "Rich document formatting",
    icon: Notebook,
  },
  {
    type: "todoNode",
    label: "Todo List",
    description: "Task checklist status",
    icon: CheckSquare,
  },
  {
    type: "tableNode",
    label: "Data Grid",
    description: "Matrix layout datasheet",
    icon: Grid,
  },
  {
    type: "socialLinkNode",
    label: "Social Embed",
    description: "Quick link card preview",
    icon: Link2,
  },
];

function CanvasInner() {
  const params = useParams();
  const serverId = (params?.serverId as string) || "rizz-hq";

  // Fallback styling based on server ID
  let activeColor = "#a855f7"; // default purple
  if (serverId.includes("rizz")) activeColor = "#ff0033";
  else if (serverId.includes("sigma")) activeColor = "#00ff66";
  else if (serverId.includes("void")) activeColor = "#a855f7";
  else if (serverId.includes("space")) activeColor = "#f59e0b";

  // ── storage reads ──────────────────────────────────────────────────────────
  const nodes = useStorage((root: Storage) => root.nodes) ?? [];
  const edges = useStorage((root: Storage) => root.edges) ?? [];

  // ── storage mutations ──────────────────────────────────────────────────────
  const onNodesChange = useMutation(
    ({ storage }, changes: NodeChange<CustomNode>[]) => {
      const list = storage.get("nodes");
      const next = applyNodeChanges(changes, list.toArray());
      list.clear();
      next.forEach((n) => list.push(n as CustomNode));
    },
    []
  );

  const onEdgesChange = useMutation(
    ({ storage }, changes: EdgeChange[]) => {
      const list = storage.get("edges");
      const next = applyEdgeChanges(changes, list.toArray());
      list.clear();
      next.forEach((e) => list.push(e));
    },
    []
  );

  const onConnect = useMutation(
    ({ storage }, connection: Connection) => {
      const list = storage.get("edges");
      const newEdge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: { stroke: activeColor, strokeWidth: 2, strokeDasharray: "5 5" },
      };
      list.push(newEdge);
    },
    [activeColor]
  );

  const addNode = useMutation(
    ({ storage }, type: CustomNode["type"], x: number, y: number) => {
      const list = storage.get("nodes");
      const id = `${type}-${Date.now()}`;

      let data: CanvasNodeData = {};
      switch (type) {
        case "textNode":
          data = { title: "Text Note", text: "Start typing ideas here..." };
          break;
        case "todoNode":
          data = {
            title: "Task Checklist",
            items: [{ id: "1", text: "First task", completed: false }],
          };
          break;
        case "tableNode":
          data = {
            title: "Data Grid",
            headers: ["Name", "Status"],
            rows: [["Task Item", "Pending"]],
          };
          break;
        case "socialLinkNode":
          data = { url: "", loaded: false };
          break;
        case "docNode":
          data = {
            title: "Untitled Document",
            content:
              "<h1>Start typing here...</h1><p>Use the toolbar to format. Auto-saves as you type.</p>",
            lastSaved: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          break;
      }

      list.push({ id, type, position: { x, y }, data } as CustomNode);
    },
    []
  );

  const clearCanvas = useMutation(
    ({ storage }) => {
      storage.get("nodes").clear();
      storage.get("edges").clear();
    },
    []
  );

  // ── drag and drop logic ──────────────────────────────────────────────────
  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();
  const updateMyPresence = useUpdateMyPresence();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!wrapperRef.current) return;
    const bounds = wrapperRef.current.getBoundingClientRect();
    updateMyPresence({ cursor: { x: e.clientX - bounds.left, y: e.clientY - bounds.top } });
  };

  const handlePointerLeave = () => updateMyPresence({ cursor: null });

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow");
      if (!type) return;
      const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNode(type as CustomNode["type"], x, y);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData("application/reactflow", type);
    e.dataTransfer.effectAllowed = "move";
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full w-full bg-black overflow-hidden font-sans select-none">
      
      {/* Draggable Blocks Sidebar (Left Side of Board) */}
      <aside className="w-56 bg-[#040404] border-r border-neutral-900 flex flex-col p-4 shrink-0 z-10">
        <div className="flex flex-col gap-1 pb-4 border-b border-neutral-900">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
            Moodboard Tools
          </span>
          <p className="text-[9px] text-neutral-600 font-medium uppercase tracking-tight">
            Drag tools onto canvas
          </p>
        </div>

        {/* Node types list */}
        <div className="flex-1 flex flex-col gap-2 py-4 overflow-y-auto custom-scrollbar">
          {nodeTypesList.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="group flex items-center gap-2.5 p-2.5 bg-[#0a0a0a] border border-neutral-900 hover:border-neutral-700 hover:bg-neutral-900/10 rounded-none cursor-grab active:cursor-grabbing transition-all duration-150"
                draggable
                onDragStart={(e) => onDragStart(e, node.type)}
              >
                <div 
                  className="p-1.5 bg-black border border-neutral-900 group-hover:border-neutral-800 transition-colors shrink-0"
                  style={{ color: activeColor }}
                >
                  <Icon size={13} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-neutral-200 group-hover:text-white uppercase transition-colors">
                    {node.label}
                  </span>
                  <span className="text-[8px] text-neutral-600 truncate mt-0.5 uppercase font-mono tracking-tight">
                    {node.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip helper */}
        <div className="p-2.5 bg-neutral-950 border border-neutral-900/60 rounded-none text-[8px] text-neutral-600 leading-normal flex items-start gap-1.5 mb-4">
          <HelpCircle size={10} className="shrink-0 mt-0.5" style={{ color: activeColor }} />
          <span className="uppercase tracking-tight font-mono">
            Pro Tip: Drag blocks onto the board to build your space.
          </span>
        </div>

        {/* Actions panel */}
        <div className="pt-3 border-t border-neutral-900 flex flex-col gap-2">
          <button
            onClick={clearCanvas}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#0a0a0a] hover:bg-red-950/20 text-neutral-500 hover:text-red-500 border border-neutral-900 hover:border-red-900 rounded-none text-[10px] font-bold uppercase transition-all duration-150 cursor-pointer"
          >
            <Trash2 size={12} />
            Clear Canvas
          </button>
        </div>
      </aside>

      {/* Main Canvas Zone */}
      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="flex-1 h-full relative"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="rounded-none bg-black"
          minZoom={0.1}
          maxZoom={4}
          colorMode="dark"
          proOptions={{ hideAttribution: true }}
        >
          {/* Brutalist lines background */}
          <Background color="#141414" gap={20} size={1.5} variant={BackgroundVariant.Lines} />



          {/* Brutalist Zoom Controls */}
          <Panel position="bottom-left" className="m-4 flex flex-col gap-3 z-50">
            <div className="flex bg-black border border-neutral-900 p-1 divide-x divide-neutral-900 rounded-none w-fit shadow-2xl">
              <button
                onClick={() => zoomIn()}
                className="p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900"
                title="Zoom In"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900"
                title="Zoom Out"
              >
                <Minus size={13} />
              </button>
              <button
                onClick={() => fitView()}
                className="p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900"
                title="Fit View"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </Panel>

          {/* Minimap overlay */}
          <MiniMap
            zoomable
            pannable
            className="!bg-black/95 !border !border-neutral-900 !rounded-none !m-4 shadow-2xl"
            nodeColor="#171717"
            maskColor="rgba(0,0,0,0.6)"
            style={{ height: 80, width: 120 }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export const NexusCanvas: React.FC = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);

export default NexusCanvas;
