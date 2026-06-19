"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LiveblocksRoomProvider } from "@/lib/liveblocks";
import { NexusCanvas } from "@/components/nexus/NexusCanvas";
import { Maximize, Cpu } from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";

export default function CanvasChannelPage() {
  const params = useParams();
  const serverId = (params?.serverId as string) || "nexus-prime";
  const channelId = (params?.channelId as string) || "prime-mood";

  const { servers, channels } = useNexusStore();
  const currentServer = servers.find((s) => s.id === serverId) || servers[0];
  const currentChannel = channels[serverId]?.find((c) => c.id === channelId) || {
    id: channelId,
    name: "mood-board",
    serverId,
    type: "canvas" as const,
  };

  const textClass = currentServer.color === "red" 
    ? "text-[#ff0033]" 
    : currentServer.color === "green" 
      ? "text-[#00ff66]" 
      : "text-neutral-400";

  return (
    <LiveblocksRoomProvider id={channelId}>
      <div className="flex-1 flex flex-col h-full bg-[#000000] font-mono overflow-hidden">
        {/* Canvas Channel Header */}
        <div className="h-14 border-b border-neutral-900 px-6 flex items-center justify-between shrink-0 bg-black/40 z-10 select-none">
          <div className="flex items-center gap-2">
            <Maximize size={14} className={`${textClass} rotate-45`} />
            <span className="font-black text-neutral-100 uppercase tracking-tight">
              {currentChannel.name}
            </span>
            <span className="text-neutral-700 mx-2">|</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
              SPATIAL WORKSPACE
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
            <Cpu size={10} className="text-[#00ff66]" /> Liveblocks Room Active
          </div>
        </div>

        {/* Spatial Canvas Viewport */}
        <div className="flex-1 w-full h-full relative">
          <NexusCanvas />
        </div>
      </div>
    </LiveblocksRoomProvider>
  );
}
