"use client";

import React from "react";
import { useOthers } from "@/lib/liveblocks";
import { MousePointer2 } from "lucide-react";

export const MultiplayerCursors: React.FC = () => {
  const others = useOthers();

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {others.map(({ id, presence }) => {
        if (!presence || !presence.cursor) return null;

        const { x, y } = presence.cursor;

        return (
          <div
            key={id}
            className="absolute transition-all duration-150 ease-out"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              left: 0,
              top: 0,
            }}
          >
            {/* Custom Mouse Pointer */}
            <MousePointer2
              size={18}
              style={{
                color: presence.color,
                fill: presence.color,
              }}
              className="drop-shadow-md transform -rotate-90 -translate-x-1.5 -translate-y-1.5"
            />
            {/* Username Label Tag */}
            <div
              className="absolute left-3 top-3 px-1.5 py-0.5 text-[9px] font-black uppercase text-black font-mono tracking-wider whitespace-nowrap shadow-md border"
              style={{
                backgroundColor: presence.color,
                borderColor: presence.color,
              }}
            >
              {presence.username}
            </div>
          </div>
        );
      })}
    </div>
  );
};
