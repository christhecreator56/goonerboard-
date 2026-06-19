"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGoonStore } from "@/store/nexusStore";
import { Hash, LayoutTemplate, ArrowRight } from "lucide-react";

export default function ServerPage() {
  const params = useParams();
  const serverId = (params?.serverId as string) || "rizz-hq";

  const { servers, channels } = useGoonStore();
  const currentServer = servers.find((s) => s.id === serverId) ?? servers[0];
  const serverChannels = channels[serverId] ?? [];

  const color = "#00ff66";
  const textChannels = serverChannels.filter((c) => c.type === "text");
  const canvasChannels = serverChannels.filter((c) => c.type === "canvas");

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#000000] custom-scrollbar">
      {/* Hero banner */}
      <div
        className="relative px-10 py-12 border-b border-neutral-900 overflow-hidden"
        style={{ background: `radial-gradient(ellipse at top left, ${color}10, transparent 60%)` }}
      >
        {/* Big server icon watermark */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[120px] opacity-5 select-none">
          {currentServer.icon}
        </div>

        <div className="relative z-10">
          <div className="text-[9px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color }}>
            ● server online
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            {currentServer.name}
          </h1>
          {currentServer.description && (
            <p className="text-sm text-neutral-500 font-medium max-w-md">
              {currentServer.description}
            </p>
          )}
        </div>
      </div>

      {/* Channel grid */}
      <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">

        {/* Chat channels */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Hash size={14} style={{ color }} />
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
              Chat channels
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {textChannels.map((ch) => (
              <Link
                key={ch.id}
                href={`/app/${serverId}/text/${ch.id}`}
                className="group flex items-center justify-between p-4 bg-neutral-950 border border-neutral-900 hover:border-neutral-700 transition-all duration-150 rounded-none"
              >
                <div className="flex items-center gap-3">
                  <Hash size={15} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                  <div>
                    <div className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">
                      {ch.name}
                    </div>
                    {ch.description && (
                      <div className="text-[11px] text-neutral-600 mt-0.5">{ch.description}</div>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
            {textChannels.length === 0 && (
              <div className="text-xs text-neutral-700 p-4 border border-dashed border-neutral-900">
                No chat channels yet.
              </div>
            )}
          </div>
        </div>

        {/* Canvas / Moodboard channels */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate size={14} style={{ color }} />
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
              Moodboards
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {canvasChannels.map((ch) => (
              <Link
                key={ch.id}
                href={`/app/${serverId}/canvas/${ch.id}`}
                className="group flex items-center justify-between p-4 border border-neutral-900 hover:border-neutral-700 transition-all duration-150 rounded-none"
                style={{
                  background: `linear-gradient(135deg, ${color}06 0%, transparent 60%)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    <LayoutTemplate size={13} style={{ color }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">
                      {ch.name}
                    </div>
                    {ch.description && (
                      <div className="text-[11px] text-neutral-600 mt-0.5">{ch.description}</div>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
            {canvasChannels.length === 0 && (
              <div className="text-xs text-neutral-700 p-4 border border-dashed border-neutral-900">
                No moodboards yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
