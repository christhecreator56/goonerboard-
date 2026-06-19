"use client";

import React, { useRef, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Minus } from "lucide-react";

import { useCanvasStore, type CustomNode } from "@/store/canvasStore";
import { TextNode } from "./nodes/TextNode";
import { TodoNode } from "./nodes/TodoNode";
import { TableNode } from "./nodes/TableNode";
import { SocialLinkNode } from "./nodes/SocialLinkNode";
import { DocNode } from "./nodes/DocNode";

// Custom node type registration
const nodeTypes = {
  textNode: TextNode,
  todoNode: TodoNode,
  tableNode: TableNode,
  socialLinkNode: SocialLinkNode,
  docNode: DocNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 5" },
};

const CanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = useReactFlow();

  const [isMoving, setIsMoving] = useState(false);

  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);
  const onConnect = useCanvasStore((state) => state.onConnect);
  const addNode = useCanvasStore((state) => state.addNode);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // Check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Project client position to react-flow coordinates
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type as CustomNode["type"], position.x, position.y);
    },
    [screenToFlowPosition, addNode]
  );

  const onMoveStart = useCallback(() => {
    setIsMoving(true);
  }, []);

  const onMoveEnd = useCallback(() => {
    setIsMoving(false);
  }, []);

  return (
    <div className="flex-1 h-full w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMoveStart={onMoveStart}
        onMoveEnd={onMoveEnd}
        fitView
        className="bg-neutral-900"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#262626"
        />
        <MiniMap
          nodeColor={() => "#a855f7"}
          maskColor="rgba(10, 10, 10, 0.7)"
          style={{
            backgroundColor: "#0a0a0a",
            borderRadius: "0.75rem",
            border: "2px solid #262626",
            transition: "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: isMoving ? 1 : 0,
            pointerEvents: isMoving ? "auto" : "none",
            transform: isMoving ? "translateY(0)" : "translateY(10px)",
          }}
          className="!bg-neutral-950"
        />
      </ReactFlow>

      {/* Custom Brutalist Zoom & Pan Controls */}
      <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1.5 p-1.5 bg-neutral-950/90 border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-md select-none">
        <button
          onClick={() => zoomOut({ duration: 300 })}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          title="Zoom Out"
        >
          <Minus size={14} />
        </button>
        <div className="h-4 w-[1px] bg-neutral-800 mx-0.5" />
        <button
          onClick={() => zoomIn({ duration: 300 })}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          title="Zoom In"
        >
          <Plus size={14} />
        </button>
        <div className="h-4 w-[1px] bg-neutral-800 mx-0.5" />
        <button
          onClick={() => fitView({ duration: 300 })}
          className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-purple-400 hover:text-purple-300 hover:bg-purple-950/20 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          title="Fit Board"
        >
          Fit
        </button>
      </div>
    </div>
  );
};

export const Canvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
};
export default Canvas;
