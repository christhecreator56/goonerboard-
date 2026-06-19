"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Check if we have a valid Liveblocks API key
const hasRealKey = 
  typeof process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY === "string" &&
  process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY.startsWith("pk_") &&
  !process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY.includes("mock");

// Type declarations
export interface Presence {
  cursor: { x: number; y: number } | null;
  username: string;
  color: string;
}

// ==========================================
// 1. MOCK MULTIPLAYER FALLBACK IMPLEMENTATION
// ==========================================

const MockRoomContext = createContext<{
  presence: Presence;
  updatePresence: (p: Partial<Presence>) => void;
  others: Array<{ id: string; presence: Presence }>;
} | null>(null);

export const MockRoomProvider: React.FC<{ id: string; children: React.ReactNode }> = ({ children }) => {
  const [presence, setPresence] = useState<Presence>({
    cursor: null,
    username: "anonymous_sigma",
    color: "#00ff66",
  });

  const [others, setOthers] = useState<Array<{ id: string; presence: Presence }>>(() => {
    const mockUsers = [
      { id: "user-1", name: "sigmaboy_99", color: "#ff0033" },
      { id: "user-2", name: "void_walker", color: "#a855f7" },
    ];
    return mockUsers.map((u) => ({
      id: u.id,
      presence: {
        cursor: { x: 300 + Math.random() * 200, y: 200 + Math.random() * 200 },
        username: u.name,
        color: u.color,
      },
    }));
  });

  const updatePresence = (p: Partial<Presence>) => {
    setPresence((prev) => ({ ...prev, ...p }));
  };

  // Simulate multiple online users moving their cursors
  useEffect(() => {
    const interval = setInterval(() => {
      setOthers((prevOthers) =>
        prevOthers.map((o) => {
          // 80% chance to move cursor slightly
          if (Math.random() > 0.2 && o.presence.cursor) {
            const dx = (Math.random() - 0.5) * 45;
            const dy = (Math.random() - 0.5) * 45;
            return {
              ...o,
              presence: {
                ...o.presence,
                cursor: {
                  x: Math.max(100, Math.min(1200, o.presence.cursor.x + dx)),
                  y: Math.max(100, Math.min(800, o.presence.cursor.y + dy)),
                },
              },
            };
          }
          return o;
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <MockRoomContext.Provider value={{ presence, updatePresence, others }}>
      {children}
    </MockRoomContext.Provider>
  );
};

// Hook definitions mapping to either real Liveblocks or the local mock
export function useMyPresence() {
  const context = useContext(MockRoomContext);
  if (!context) {
    return [
      { cursor: null, username: "anonymous_sigma", color: "#00ff66" },
      () => {},
    ] as [Presence, (p: Partial<Presence>) => void];
  }
  return [context.presence, context.updatePresence] as [Presence, (p: Partial<Presence>) => void];
}

export function useUpdateMyPresence() {
  const context = useContext(MockRoomContext);
  if (!context) return () => {};
  return context.updatePresence;
}

export function useOthers() {
  const context = useContext(MockRoomContext);
  if (!context) return [];
  return context.others;
}

// Keep it generic to support future real Liveblocks room integrations
export const LiveblocksRoomProvider = MockRoomProvider;
