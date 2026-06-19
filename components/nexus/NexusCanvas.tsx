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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { usePathname } from "next/navigation";
import { useCanvasStore } from "@/store/canvasStore";
import { useUpdateMyPresence } from "@/lib/liveblocks";
import { MultiplayerCursors } from "./MultiplayerCursors";

// Custom Nodes imports
import { NexusTextNode } from "./nodes/NexusTextNode";
import { NexusTodoNode } from "./nodes/NexusTodoNode";
import { NexusTableNode } from "./nodes/NexusTableNode";
import { NexusSocialLinkNode } from "./nodes/NexusSocialLinkNode";
import { NexusDocNode } from "./nodes/NexusDocNode";

// Icons
import {
  Plus,
  Minus,
  Maximize2,
  FileText,
  Notebook,
  CheckSquare,
  Grid,
  Link2,
} from "lucide-react";

const nodeTypes = {
  textNode: NexusTextNode,
  todoNode: NexusTodoNode,
  tableNode: NexusTableNode,
  socialLinkNode: NexusSocialLinkNode,
  docNode: NexusDocNode,
};

function CanvasInner() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const serverId = segments[1] || "nexus-prime";

  const isRed = serverId === "nexus-prime";
  const accentColor = isRed ? "#ff0033" : "#00ff66";
  const textClass = isRed ? "text-[#ff0033]" : "text-[#00ff66]";
  const borderClass = isRed ? "border-[#ff0033]" : "border-[#00ff66]";
  const bgHoverClass = isRed ? "hover:bg-[#ff0033]/15 hover:border-[#ff0033]" : "hover:bg-[#00ff66]/15 hover:border-[#00ff66]";

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useCanvasStore();

  const { zoomIn, zoomOut, fitView, screenToFlowPosition } = useReactFlow();
  const updateMyPresence = useUpdateMyPresence();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Broadcast mouse cursor coordinates
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!reactFlowWrapper.current) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    updateMyPresence({ cursor: { x, y } });
  };

  const handlePointerLeave = () => {
    updateMyPresence({ cursor: null });
  };

  // Drag and drop node creation from Sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type as any, position.x, position.y);
    },
    [screenToFlowPosition, addNode]
  );

  // Quick Spawn Nodes at viewport center
  const spawnNode = (type: string) => {
    const x = 300 + Math.random() * 100;
    const y = 200 + Math.random() * 100;
    addNode(type as any, x, y);
  };

  return (
    <div
      ref={reactFlowWrapper}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex-1 w-full h-full relative bg-[#000000] select-none"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="rounded-none"
        minZoom={0.1}
        maxZoom={4}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        {/* Brutalist Grid Background */}
        <Background
          color="#171717"
          gap={20}
          size={1.5}
          variant={BackgroundVariant.Lines}
        />

        {/* Real-time cursors layer */}
        <MultiplayerCursors />

        {/* BRUTALIST ZOOM & SPAWN CONTROL PANEL */}
        <Panel position="bottom-left" className="m-4 flex flex-col gap-3 z-50">
          
          {/* Quick Spawn Buttons */}
          <div className="flex bg-black border border-neutral-900 p-1 divide-x divide-neutral-900 rounded-none shadow-2xl">
            <button
              onClick={() => spawnNode("textNode")}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
              title="Spawn Text Note"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={() => spawnNode("docNode")}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
              title="Spawn Rich Doc"
            >
              <Notebook size={14} />
            </button>
            <button
              onClick={() => spawnNode("todoNode")}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
              title="Spawn Checklist"
            >
              <CheckSquare size={14} />
            </button>
            <button
              onClick={() => spawnNode("tableNode")}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
              title="Spawn Grid Matrix"
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => spawnNode("socialLinkNode")}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
              title="Spawn Link Embed"
            >
              <Link2 size={14} />
            </button>
          </div>

          {/* Navigation Zoom Controls */}
          <div className="flex bg-black border border-neutral-900 p-1 divide-x divide-neutral-900 rounded-none w-fit shadow-2xl">
            <button
              onClick={() => zoomIn()}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => zoomOut()}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
            >
              <Minus size={14} />
            </button>
            <button
              onClick={() => fitView()}
              className={`p-2 transition-all rounded-none cursor-pointer flex items-center justify-center text-neutral-400 ${bgHoverClass}`}
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </Panel>

        {/* Intelligent Minimap */}
        <MiniMap
          zoomable
          pannable
          className="!bg-black/90 !border !border-neutral-900 !rounded-none !m-4 shadow-2xl"
          nodeColor="#171717"
          maskColor="rgba(0, 0, 0, 0.6)"
          style={{ height: 100, width: 150 }}
        />
      </ReactFlow>
    </div>
  );
}

export const NexusCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};
export default NexusCanvas;
