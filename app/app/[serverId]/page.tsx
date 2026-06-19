"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useNexusStore, type Server } from "@/store/nexusStore";
import { Hash, Maximize, ShieldAlert, Cpu } from "lucide-react";

export default function ServerPage() {
  const params = useParams();
  const serverId = (params?.serverId as string) || "nexus-prime";

  const { servers, channels } = useNexusStore();

  const currentServer = servers.find((s) => s.id === serverId) || servers[0];
  const serverChannels = channels[serverId] || [];

  const accentColor = currentServer.color === "red" ? "#ff0033" : currentServer.color === "green" ? "#00ff66" : "#737373";
  const borderClass = currentServer.color === "red" ? "border-[#ff0033]" : currentServer.color === "green" ? "border-[#00ff66]" : "border-neutral-800";
  const textClass = currentServer.color === "red" ? "text-[#ff0033]" : currentServer.color === "green" ? "text-[#00ff66]" : "text-neutral-400";
  const bgClass = currentServer.color === "red" ? "bg-[#ff0033]/5" : currentServer.color === "green" ? "bg-[#00ff66]/5" : "bg-neutral-900/10";
  const hoverBorderClass = currentServer.color === "red" ? "hover:border-[#ff0033] hover:bg-[#ff0033]/10" : currentServer.color === "green" ? "hover:border-[#00ff66] hover:bg-[#00ff66]/10" : "hover:border-neutral-500 hover:bg-neutral-800/40";

  return (
    <div className="flex-1 bg-[#000000] p-8 flex flex-col font-mono relative overflow-y-auto custom-scrollbar select-none">
      {/* Background terminal matrix lines decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_16px] pointer-events-none" />

      {/* Server Welcome banner */}
      <div className={`border-2 ${borderClass} ${bgClass} p-8 mb-8 relative`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-1.5 flex items-center gap-1.5">
              <Cpu size={12} className={textClass} /> Connection Node Active
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">
              Welcome to <span className={textClass}>{currentServer.name}</span>
            </h1>
            <p className="text-xs text-neutral-400 uppercase leading-relaxed max-w-xl">
              This node hosts both text-based communication threads and spatial canvas moodboards. Select a feed below to connect.
            </p>
          </div>
          <div className={`text-4xl font-black opacity-10 select-none ${textClass}`}>
            {currentServer.icon}
          </div>
        </div>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Text Channels Segment */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-900 pb-2">
            // TEXT COMMUNICATIONS
          </h2>
          <div className="flex flex-col gap-2">
            {serverChannels
              .filter((c) => c.type === "text")
              .map((channel) => (
                <Link
                  key={channel.id}
                  href={`/app/${serverId}/text/${channel.id}`}
                  className={`border border-neutral-900 bg-neutral-950 p-4 transition-all duration-150 flex items-center justify-between group rounded-none cursor-pointer ${hoverBorderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <Hash size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
                    <span className="font-bold uppercase tracking-tight text-neutral-200">
                      #{channel.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-600 group-hover:text-white transition-colors uppercase font-bold tracking-wider">
                    Connect Feed
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Spatial Canvas Segment */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-900 pb-2">
            // SPATIAL CANVASES
          </h2>
          <div className="flex flex-col gap-2">
            {serverChannels
              .filter((c) => c.type === "canvas")
              .map((channel) => (
                <Link
                  key={channel.id}
                  href={`/app/${serverId}/canvas/${channel.id}`}
                  className={`border border-neutral-900 bg-neutral-950 p-4 transition-all duration-150 flex items-center justify-between group rounded-none cursor-pointer ${hoverBorderClass}`}
                >
                  <div className="flex items-center gap-3">
                    <Maximize size={16} className="text-neutral-500 group-hover:text-white transition-colors rotate-45" />
                    <span className="font-bold uppercase tracking-tight text-neutral-200">
                      {channel.name}
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-600 group-hover:text-white transition-colors uppercase font-bold tracking-wider">
                    Load Workspace
                  </span>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}
