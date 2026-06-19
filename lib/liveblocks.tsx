"use client";

/**
 * lib/liveblocks.tsx
 *
 * Pure mock multiplayer layer. Exposes the same hook surface as @liveblocks/react
 * without requiring a live API key or triggering SDK type constraints.
 *
 * To swap in the real Liveblocks SDK in future:
 *   1. Install @liveblocks/client @liveblocks/react
 *   2. Replace the exports below with createRoomContext() equivalents
 *   3. Add NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY to .env.local
 */

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { type CustomNode, type CanvasNodeData } from "@/store/canvasStore";
import { type Edge } from "@xyflow/react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Presence {
  cursor: { x: number; y: number } | null;
  username: string;
  color: string;
}

export interface Storage {
  nodes: CustomNode[];
  edges: Edge[];
}

export type OtherUser = { id: string; presence: Presence };

// Signature-compatible with Liveblocks mutation context (mock storage only)
export interface MockMutationContext {
  storage: MockStorage;
  setMyPresence: (p: Partial<Presence>) => void;
}

// The mock "LiveList-like" storage object
export interface MockStorage {
  get(key: "nodes"): MockList<CustomNode>;
  get(key: "edges"): MockList<Edge>;
}

export interface MockList<T> {
  toArray(): T[];
  push(item: T): void;
  clear(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-room storage cache (survives re-mounts within a session)
// ─────────────────────────────────────────────────────────────────────────────

const roomCache: Record<string, Storage> = {};

function buildInitialStorage(roomId: string): Storage {
  if (roomCache[roomId]) return roomCache[roomId];

  const hasWelcome =
    roomId.includes("prime") || roomId.includes("mood") || roomId.includes("welcome");

  const initial: Storage = {
    nodes: hasWelcome
      ? ([
          {
            id: "welcome-text",
            type: "textNode",
            position: { x: 100, y: 100 },
            data: {
              title: "Project Canvas",
              text: "Welcome! Drag blocks from the tools panel on the left onto the board to build your space.",
            },
          },
          {
            id: "welcome-todo",
            type: "todoNode",
            position: { x: 520, y: 100 },
            data: {
              title: "Launch Checklist",
              items: [
                { id: "1", text: "Wireframe canvas layouts", completed: true },
                { id: "2", text: "Connect Liveblocks mock sync", completed: false },
                { id: "3", text: "Refine user flows", completed: false },
              ],
            },
          },
          {
            id: "welcome-table",
            type: "tableNode",
            position: { x: 100, y: 380 },
            data: {
              title: "Sprint Tracker",
              headers: ["Task", "Owner", "Status"],
              rows: [
                ["Auth Module", "you", "Completed"],
                ["Canvas Nodes", "you", "In Progress"],
                ["Docs Editor", "you", "Backlog"],
              ],
            },
          },
          {
            id: "welcome-social",
            type: "socialLinkNode",
            position: { x: 520, y: 380 },
            data: {
              url: "https://github.com/xyflow/xyflow",
              title: "React Flow GitHub",
              description: "Wire-first diagrams and infinite canvas boards.",
              platform: "github",
              loaded: true,
            },
          },
        ] as CustomNode[])
      : [],
    edges: hasWelcome
      ? [
          {
            id: "e-text-todo",
            source: "welcome-text",
            target: "welcome-todo",
            animated: true,
            style: { stroke: "#a855f7", strokeWidth: 2, strokeDasharray: "5 5" },
          },
        ]
      : [],
  };

  roomCache[roomId] = initial;
  return initial;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

interface MockRoomContextValue {
  roomId: string;
  presence: Presence;
  updatePresence: (p: Partial<Presence>) => void;
  others: OtherUser[];
  storage: Storage;
  mutateStorage: (fn: (storage: MockStorage) => void) => void;
}

const MockRoomContext = createContext<MockRoomContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export const MockRoomProvider: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const [presence, setPresence] = useState<Presence>({
    cursor: null,
    username: "anonymous_sigma",
    color: "#00ff66",
  });

  const [storage, setStorage] = useState<Storage>(() => buildInitialStorage(id));

  // Keep the cache in sync whenever storage mutates
  const applyMutation = useCallback(
    (fn: (s: MockStorage) => void) => {
      setStorage((prev) => {
        // shallow-clone both arrays so React sees a new reference
        let nodes = [...prev.nodes];
        let edges = [...prev.edges];

        const mockStorage = {
          get(key: "nodes" | "edges") {
            if (key === "nodes") {
              return {
                toArray: () => nodes,
                push: (item: CustomNode) => { nodes = [...nodes, item]; },
                clear: () => { nodes = []; },
              };
            }
            return {
              toArray: () => edges,
              push: (item: Edge) => { edges = [...edges, item]; },
              clear: () => { edges = []; },
            };
          },
        } as unknown as MockStorage;

        fn(mockStorage);
        const next = { nodes, edges };
        roomCache[id] = next;
        return next;
      });
    },
    [id]
  );

  const updatePresence = useCallback((p: Partial<Presence>) => {
    setPresence((prev) => ({ ...prev, ...p }));
  }, []);

  // Simulated other cursors
  const [others] = useState<OtherUser[]>([
    {
      id: "mock-1",
      presence: {
        cursor: { x: 350, y: 220 },
        username: "sigmaboy_99",
        color: "#ff0033",
      },
    },
    {
      id: "mock-2",
      presence: {
        cursor: { x: 600, y: 380 },
        username: "void_walker",
        color: "#a855f7",
      },
    },
  ]);

  // Cursors are now static, no movement interval needed.

  return (
    <MockRoomContext.Provider
      value={{ roomId: id, presence, updatePresence, others, storage, mutateStorage: applyMutation }}
    >
      {children}
    </MockRoomContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Public Room Provider (swap this for real Liveblocks RoomProvider later)
// ─────────────────────────────────────────────────────────────────────────────

export const LiveblocksRoomProvider: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  return (
    <MockRoomProvider key={id} id={id}>
      {children}
    </MockRoomProvider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

function useRoom(): MockRoomContextValue {
  const ctx = useContext(MockRoomContext);
  if (!ctx) {
    throw new Error("useRoom must be used inside <LiveblocksRoomProvider>");
  }
  return ctx;
}

/** Returns [presence, updatePresence] tuple */
export function useMyPresence(): [Presence, (p: Partial<Presence>) => void] {
  const { presence, updatePresence } = useRoom();
  return [presence, updatePresence];
}

/** Returns only the updatePresence setter */
export function useUpdateMyPresence(): (p: Partial<Presence>) => void {
  const { updatePresence } = useRoom();
  return updatePresence;
}

/** Returns other users in the room */
export function useOthers(): OtherUser[] {
  const { others } = useRoom();
  return others;
}

/** Selector-based storage read, re-renders on every storage mutation */
export function useStorage<T>(selector: (root: Storage) => T): T {
  const { storage } = useRoom();
  return selector(storage);
}

/**
 * useMutation — returns a stable callback that receives a MockMutationContext
 * and any additional args you pass.
 *
 * Usage:
 *   const doSomething = useMutation(({ storage }, arg1, arg2) => { ... }, []);
 */
export function useMutation<Args extends unknown[]>(
  callback: (ctx: MockMutationContext, ...args: Args) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _deps: React.DependencyList
): (...args: Args) => void {
  const { mutateStorage, updatePresence } = useRoom();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (...args: Args) => {
      mutateStorage((storage) => {
        callbackRef.current({ storage, setMyPresence: updatePresence }, ...args);
      });
    },
    [mutateStorage, updatePresence]
  );
}

/** Update a specific node's data fields */
export function useUpdateNodeData(): (
  nodeId: string,
  data: Partial<CanvasNodeData>
) => void {
  const { mutateStorage } = useRoom();

  return useCallback(
    (nodeId: string, data: Partial<CanvasNodeData>) => {
      mutateStorage((storage) => {
        const list = storage.get("nodes");
        const nodes = list.toArray();
        list.clear();
        nodes.forEach((n) => {
          if (n.id === nodeId) {
            list.push({ ...n, data: { ...n.data, ...data } });
          } else {
            list.push(n);
          }
        });
      });
    },
    [mutateStorage]
  );
}

/** Delete a node and its connected edges */
export function useDeleteNode(): (nodeId: string) => void {
  const { mutateStorage } = useRoom();

  return useCallback(
    (nodeId: string) => {
      mutateStorage((storage) => {
        const nodeList = storage.get("nodes");
        const kept = nodeList.toArray().filter((n) => n.id !== nodeId);
        nodeList.clear();
        kept.forEach((n) => nodeList.push(n));

        const edgeList = storage.get("edges");
        const keptEdges = edgeList
          .toArray()
          .filter((e) => e.source !== nodeId && e.target !== nodeId);
        edgeList.clear();
        keptEdges.forEach((e) => edgeList.push(e));
      });
    },
    [mutateStorage]
  );
}
