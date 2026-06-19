"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNexusStore, type Server, type Channel, type Member } from "@/store/nexusStore";
import {
  MessageSquare,
  FileText,
  Users,
  Compass,
  Settings,
  LogOut,
  Power,
  ChevronDown,
  Hash,
  Maximize,
  Volume2
} from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Parse path segments to extract active server/channel
  const segments = pathname.split("/").filter(Boolean);
  const activeServerId = segments[1] || "nexus-prime";
  const activeChannelType = segments[2]; // "text" | "canvas"
  const activeChannelId = segments[3];

  const { servers, channels, members, currentUser, setCurrentUser } = useNexusStore();

  const currentServer = servers.find((s) => s.id === activeServerId) || servers[0];
  const serverChannels = channels[activeServerId] || [];
  const serverMembers = members[activeServerId] || [];

  // Accent logic based on the active server's theme profile
  const getAccentColor = (server: Server) => {
    if (server.color === "red") return "#ff0033";
    if (server.color === "green") return "#00ff66";
    return "#737373"; // grey
  };

  const accentColor = getAccentColor(currentServer);
  const textClass = currentServer.color === "red" 
    ? "text-[#ff0033]" 
    : currentServer.color === "green" 
      ? "text-[#00ff66]" 
      : "text-neutral-400";
  const borderClass = currentServer.color === "red" 
    ? "border-[#ff0033]" 
    : currentServer.color === "green" 
      ? "border-[#00ff66]" 
      : "border-neutral-700";
  const bgHoverClass = currentServer.color === "red" 
    ? "hover:bg-[#ff0033]/10" 
    : currentServer.color === "green" 
      ? "hover:bg-[#00ff66]/10" 
      : "hover:bg-neutral-800/40";
  const bgActiveClass = currentServer.color === "red" 
    ? "bg-[#ff0033]/10 text-white border-l-2 border-[#ff0033]" 
    : currentServer.color === "green" 
      ? "bg-[#00ff66]/10 text-white border-l-2 border-[#00ff66]" 
      : "bg-neutral-800 text-white border-l-2 border-neutral-600";

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
  };

  return (
    <div className="h-screen w-screen bg-[#000000] text-neutral-100 flex overflow-hidden font-mono text-sm select-none">
      
      {/* ========================================== */}
      {/* PANE 1: SERVERS (w-16, pure black background) */}
      {/* ========================================== */}
      <aside className="w-16 bg-[#000000] border-r border-neutral-900 flex flex-col items-center py-4 gap-3 shrink-0">
        {/* Core Compass Icon */}
        <Link
          href="/app"
          className={`w-11 h-11 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-500 transition-all rounded-none`}
          title="Direct Messages"
        >
          <Compass size={18} />
        </Link>
        <div className="w-8 h-[1px] bg-neutral-900 my-1" />

        {/* Server List */}
        <div className="flex-1 flex flex-col gap-2.5 w-full items-center overflow-y-auto custom-scrollbar">
          {servers.map((server) => {
            const isSelected = server.id === activeServerId;
            const sAccent = getAccentColor(server);
            return (
              <Link
                key={server.id}
                href={`/app/${server.id}`}
                className={`w-11 h-11 flex items-center justify-center font-black text-base border transition-all rounded-none ${
                  isSelected
                    ? `bg-black border-[2px]`
                    : "border-neutral-900 bg-neutral-950/40 text-neutral-400 hover:text-white hover:border-neutral-600"
                }`}
                style={{
                  borderColor: isSelected ? sAccent : undefined,
                  color: isSelected ? sAccent : undefined,
                }}
                title={server.name}
              >
                {server.icon}
              </Link>
            );
          })}
        </div>

        {/* Bottom User Actions */}
        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={handleLogout}
            className="w-11 h-11 border border-neutral-900 hover:border-red-500/40 text-neutral-500 hover:text-red-500 flex items-center justify-center transition-all rounded-none cursor-pointer"
            title="Disconnect"
          >
            <Power size={16} />
          </button>
        </div>
      </aside>

      {/* ========================================== */}
      {/* PANE 2: CHANNELS (w-64, bg-neutral-950) */}
      {/* ========================================== */}
      <section className="w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col shrink-0">
        {/* Server Header */}
        <div className={`h-14 border-b border-neutral-900 px-4 flex items-center justify-between font-black tracking-tighter text-xs ${textClass}`}>
          <span className="uppercase">{currentServer.name}</span>
          <ChevronDown size={14} className="opacity-60" />
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5 custom-scrollbar">
          {/* Category: Text Channels */}
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-2 py-1 select-none flex items-center justify-between">
              <span>Text Channels</span>
              <span className="text-xs cursor-pointer hover:text-neutral-400 font-normal">+</span>
            </div>
            {serverChannels
              .filter((c) => c.type === "text")
              .map((channel) => {
                const isActive = activeChannelId === channel.id;
                return (
                  <Link
                    key={channel.id}
                    href={`/app/${activeServerId}/text/${channel.id}`}
                    className={`flex items-center gap-2 px-2.5 py-1.5 transition-all text-xs font-semibold rounded-none ${
                      isActive ? bgActiveClass : `text-neutral-500 ${bgHoverClass} hover:text-neutral-300`
                    }`}
                  >
                    <Hash size={12} className="shrink-0 opacity-70" />
                    <span className="truncate">{channel.name}</span>
                  </Link>
                );
              })}
          </div>

          {/* Category: Spatial Canvases */}
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-2 py-1 select-none flex items-center justify-between">
              <span>Spatial Canvases</span>
              <span className="text-xs cursor-pointer hover:text-neutral-400 font-normal">+</span>
            </div>
            {serverChannels
              .filter((c) => c.type === "canvas")
              .map((channel) => {
                const isActive = activeChannelId === channel.id;
                return (
                  <Link
                    key={channel.id}
                    href={`/app/${activeServerId}/canvas/${channel.id}`}
                    className={`flex items-center gap-2 px-2.5 py-1.5 transition-all text-xs font-semibold rounded-none ${
                      isActive ? bgActiveClass : `text-neutral-500 ${bgHoverClass} hover:text-neutral-300`
                    }`}
                  >
                    <Maximize size={12} className="shrink-0 opacity-70 rotate-45" />
                    <span className="truncate">{channel.name}</span>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* User Identity Panel */}
        {currentUser && (
          <div className="h-16 border-t border-neutral-900 bg-black/40 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {/* Colored status dot indicator */}
              <div
                className="w-7 h-7 flex items-center justify-center font-bold text-black text-xs shrink-0 select-none"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-200 truncate uppercase">
                  {currentUser.username}
                </span>
                <span className="text-[9px] text-[#00ff66] font-bold tracking-widest uppercase">
                  Online
                </span>
              </div>
            </div>
            <button className="p-1.5 text-neutral-500 hover:text-white rounded-none transition-colors cursor-pointer">
              <Settings size={14} />
            </button>
          </div>
        )}
      </section>

      {/* ========================================== */}
      {/* PANE 3: MAIN VIEWPORT (Children content) */}
      {/* ========================================== */}
      <main className="flex-1 bg-[#000000] flex flex-col relative overflow-hidden">
        {children}
      </main>

      {/* ========================================== */}
      {/* PANE 4: MEMBERS PRESENCE (w-60, bg-neutral-950) */}
      {/* ========================================== */}
      <aside className="w-60 bg-neutral-950 border-l border-neutral-900 flex flex-col shrink-0">
        <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between font-bold text-neutral-500 text-xs">
          <span className="flex items-center gap-1.5 uppercase">
            <Users size={12} /> MEMBERS ({serverMembers.length})
          </span>
        </div>

        {/* Member list content */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4 custom-scrollbar">
          {serverMembers.map((member) => (
            <div key={member.id} className="flex flex-col gap-1 px-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-none"
                  style={{
                    backgroundColor: member.status === "online" ? member.color : "#404040",
                  }}
                />
                <span
                  className={`text-xs font-bold uppercase truncate transition-colors ${
                    member.status === "online" ? "text-neutral-200" : "text-neutral-600"
                  }`}
                >
                  {member.username}
                </span>
              </div>
              {member.status === "online" && member.activity && (
                <span className="text-[9px] text-neutral-500 uppercase pl-3.5 tracking-wide leading-tight truncate">
                  Playing: {member.activity}
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}
