"use client";

import React from "react";
import { useParams } from "next/navigation";
import { LiveblocksRoomProvider } from "@/lib/liveblocks";
import { NexusCanvas } from "@/components/nexus/NexusCanvas";
import { useGoonStore } from "@/store/nexusStore";
import { LayoutTemplate } from "lucide-react";

export default function CanvasChannelPage() {
  const params = useParams();
  const serverId  = (params?.serverId  as string) || "rizz-hq";
  const channelId = (params?.channelId as string) || "rizz-moodboard";

  const { channels } = useGoonStore();
  const currentChannel = channels[serverId]?.find((c) => c.id === channelId) ?? {
    id: channelId, name: "moodboard", serverId, type: "canvas" as const, description: "",
  };

  const color = "#00ff66";

  return (
    <LiveblocksRoomProvider id={channelId}>
      <div className="flex-1 flex flex-col h-full bg-[#000000] overflow-hidden">
        {/* Sub-header for canvas-specific info */}
        <div
          className="h-9 border-b border-neutral-900/60 px-4 flex items-center gap-3 shrink-0 bg-[#020202]"
          style={{ borderBottomColor: `${color}20` }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color }}>
              Live Canvas
            </span>
          </div>
          <div className="text-neutral-800">|</div>
          <span className="text-[9px] text-neutral-700 font-medium">
            {currentChannel.description || "Spatial moodboard workspace"}
          </span>
          <div className="ml-auto flex items-center gap-2 text-[9px] text-neutral-700 font-bold uppercase tracking-widest">
            <LayoutTemplate size={9} />
            {channelId}
          </div>
        </div>

        {/* Spatial Canvas */}
        <div className="flex-1 w-full relative">
          <NexusCanvas />
        </div>
      </div>
    </LiveblocksRoomProvider>
  );
}
