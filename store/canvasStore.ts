import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
} from "@xyflow/react";

export interface CanvasNodeData extends Record<string, any> {
  title?: string;
  text?: string;
  items?: TodoItem[];
  headers?: string[];
  rows?: string[][];
  url?: string;
  description?: string;
  platform?: string;
  loaded?: boolean;
  content?: string;
  lastSaved?: string;
}

export type CustomNode = Node<CanvasNodeData> & {
  type: "textNode" | "todoNode" | "tableNode" | "socialLinkNode" | "docNode";
};

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CanvasState {
  nodes: CustomNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<CustomNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (type: CustomNode["type"], x: number, y: number) => void;
  updateNodeData: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [
        {
          id: "welcome-text",
          type: "textNode",
          position: { x: 100, y: 100 },
          data: {
            title: "Welcome to GoonBoard",
            text: "This is a spatial productivity canvas. Drag blocks from the sidebar, draw rizz-lines between handles, and build your ultimate workspace.\n\nDouble click to edit titles or text content!",
          },
        },
        {
          id: "welcome-todo",
          type: "todoNode",
          position: { x: 500, y: 100 },
          data: {
            title: "Mewing Checklist",
            items: [
              { id: "1", text: "100 mewing reps", completed: true },
              { id: "2", text: "Cold shower", completed: false },
              { id: "3", text: "Avoid mid apps", completed: false },
            ],
          },
        },
        {
          id: "welcome-table",
          type: "tableNode",
          position: { x: 100, y: 400 },
          data: {
            title: "Sigma Stat Tracker",
            headers: ["Date", "Weight (kg)", "Focus Level"],
            rows: [
              ["06-17", "78.2", "High"],
              ["06-18", "78.0", "Over 9000"],
              ["06-19", "78.5", "Sigma Mode"],
            ],
          },
        },
        {
          id: "welcome-social",
          type: "socialLinkNode",
          position: { x: 500, y: 400 },
          data: {
            url: "https://github.com/xyflow/xyflow",
            title: "React Flow GitHub",
            description: "Wire-first diagrams and infinite canvas boards.",
            platform: "github",
            loaded: true,
          },
        },
      ] as CustomNode[],
      edges: [
        {
          id: "e-text-todo",
          source: "welcome-text",
          target: "welcome-todo",
          animated: true,
          style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 5" },
        },
        {
          id: "e-todo-social",
          source: "welcome-todo",
          target: "welcome-social",
          animated: true,
          style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 5" },
        },
      ],
      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes) as CustomNode[],
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        const edge: Edge = {
          ...connection,
          id: `e-${connection.source}-${connection.target}-${Date.now()}`,
          animated: true,
          style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 5" },
        };
        set({
          edges: addEdge(edge, get().edges),
        });
      },
      addNode: (type, x, y) => {
        const id = `${type}-${Date.now()}`;
        let initialData: any = {};

        switch (type) {
          case "textNode":
            initialData = {
              title: "New Note",
              text: "Write something sigma here...",
            };
            break;
          case "todoNode":
            initialData = {
              title: "Task Checklist",
              items: [{ id: "1", text: "First task", completed: false }],
            };
            break;
          case "tableNode":
            initialData = {
              title: "Grid Tracker",
              headers: ["Header 1", "Header 2"],
              rows: [["Cell A1", "Cell A2"]],
            };
            break;
          case "socialLinkNode":
            initialData = {
              url: "",
              loaded: false,
            };
            break;
          case "docNode":
            initialData = {
              title: "Untitled Document",
              content: "<h1>Start typing here...</h1><p>Use the toolbar above to format your text. This document is fully editable and persists automatically.</p>",
              lastSaved: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            break;
        }

        const newNode: CustomNode = {
          id,
          type,
          position: { x, y },
          data: initialData,
        };

        set({
          nodes: [...get().nodes, newNode],
        });
      },
      updateNodeData: (nodeId, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  ...data,
                },
              };
            }
            return node;
          }),
        });
      },
      deleteNode: (nodeId) => {
        set({
          nodes: get().nodes.filter((node) => node.id !== nodeId),
          edges: get().edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
          ),
        });
      },
      clearCanvas: () => {
        set({ nodes: [], edges: [] });
      },
    }),
    {
      name: "goonboard-canvas-store",
    }
  )
);
