"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useGoonStore, type Server, type Member } from "@/store/nexusStore";
import {
  Hash,
  LayoutTemplate,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Search,
  Bell,
  Pin,
  Crown,
  Shield,
} from "lucide-react";

// ─── Accent helpers ───────────────────────────────────────────────────────────
function accent(_?: any) {
  return "#00ff66";
}
function accentBg(_?: any) {
  return "bg-[#00ff66]/10 border-l-2 border-[#00ff66] text-white";
}
function accentHover(_?: any) {
  return "hover:bg-[#00ff66]/8 hover:text-neutral-100";
}
function accentText(_?: any) {
  return "text-[#00ff66]";
}

// ─── Main layout ──────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [membersSidebarOpen, setMembersSidebarOpen] = useState(true);

  const segs = pathname.split("/").filter(Boolean);
  const activeServerId = segs[1] || "rizz-hq";
  const activeChannelType = segs[2]; // "text" | "canvas"
  const activeChannelId = segs[3];

  const { servers, channels, members, currentUser, setCurrentUser } = useGoonStore();
  const currentServer = servers.find((s) => s.id === activeServerId) ?? servers[0];
  const serverChannels = channels[activeServerId] ?? [];
  const serverMembers = members[activeServerId] ?? [];

  const textChannels = serverChannels.filter((c) => c.type === "text");
  const canvasChannels = serverChannels.filter((c) => c.type === "canvas");

  const isCanvasActive = activeChannelType === "canvas";

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/login");
  };

  // ─── server icon pill ──────────────────────────────────────────────────────
  const ServerPill = ({ server }: { server: Server }) => {
    const isActive = server.id === activeServerId;
    const color = accent(server);
    return (
      <div className="relative group flex items-center">
        {/* Active indicator bar */}
        <div
          className={`absolute -left-3 w-1 rounded-r-full transition-all duration-200 ${
            isActive ? "h-8" : "h-0 group-hover:h-4"
          }`}
          style={{ backgroundColor: color }}
        />
        <Link
          href={`/app/${server.id}`}
          title={server.name}
          className={`w-12 h-12 flex items-center justify-center text-xl font-black rounded-[16px] transition-all duration-200 shrink-0 ${
            isActive
              ? "rounded-[12px]"
              : "hover:rounded-[12px]"
          }`}
          style={{
            backgroundColor: isActive ? `${color}22` : "#1a1a1a",
            border: isActive ? `2px solid ${color}` : "2px solid transparent",
          }}
        >
          {server.icon}
        </Link>
        {/* Tooltip */}
        <div className="absolute left-14 z-50 px-2.5 py-1.5 bg-black border border-neutral-800 text-white text-xs font-bold whitespace-nowrap rounded-none opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
          {server.name}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-black border-l border-t border-neutral-800 rotate-[-45deg]" />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen bg-[#000000] text-neutral-100 flex overflow-hidden font-mono text-sm">

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PANE 1 — SERVER RAIL (72px, pure black)                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <nav className="w-[72px] bg-[#000000] flex flex-col items-center py-3 gap-2 shrink-0 overflow-y-auto custom-scrollbar">
        {/* Home / DM */}
        <Link
          href="/app"
          className="w-12 h-12 rounded-[16px] hover:rounded-[12px] bg-[#1a1a1a] hover:bg-[#ff0033] flex items-center justify-center text-neutral-400 hover:text-white transition-all duration-200 shrink-0"
          title="Home"
        >
          <span className="text-lg font-black">G</span>
        </Link>

        {/* Separator */}
        <div className="w-8 h-px bg-neutral-800 my-1 shrink-0" />

        {/* Server list */}
        <div className="flex flex-col items-center gap-2 flex-1 w-full px-3">
          {servers.map((s) => <ServerPill key={s.id} server={s} />)}
        </div>

        {/* Separator + Add server */}
        <div className="w-8 h-px bg-neutral-800 my-1 shrink-0" />
        <button
          className="w-12 h-12 rounded-[16px] hover:rounded-[12px] bg-[#1a1a1a] hover:bg-[#00ff66]/20 border-2 border-dashed border-neutral-800 hover:border-[#00ff66] flex items-center justify-center text-neutral-500 hover:text-[#00ff66] transition-all duration-200 shrink-0"
          title="Add a server"
        >
          <Plus size={18} />
        </button>

        {/* Discover */}
        <button
          className="w-12 h-12 rounded-[16px] hover:rounded-[12px] bg-[#1a1a1a] hover:bg-[#00ff66]/20 flex items-center justify-center text-neutral-500 hover:text-[#00ff66] transition-all duration-200 shrink-0"
          title="Discover servers"
        >
          <Search size={16} />
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PANE 2 — CHANNEL LIST (240px)                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="w-60 bg-[#0a0a0a] border-x border-neutral-900 flex flex-col shrink-0">

        {/* Server name header */}
        <div
          className="h-12 border-b border-neutral-900 px-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors select-none"
          style={{ borderBottom: `1px solid ${accent(currentServer)}22` }}
        >
          <span
            className="font-black tracking-tighter text-sm uppercase"
            style={{ color: accent(currentServer) }}
          >
            {currentServer.name}
          </span>
          <ChevronDown size={14} className="text-neutral-500" />
        </div>

        {/* Search bar */}
        <div className="px-3 py-2 border-b border-neutral-900/50">
          <div className="flex items-center gap-2 bg-neutral-900/60 px-2.5 py-1.5 rounded-none">
            <Search size={11} className="text-neutral-600" />
            <span className="text-[11px] text-neutral-600 font-medium">Find a channel…</span>
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-4 custom-scrollbar">

          {/* TEXT CHANNELS */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 group">
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                Chat
              </span>
              <button className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-neutral-300 transition-all">
                <Plus size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {textChannels.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <Link
                    key={ch.id}
                    href={`/app/${activeServerId}/text/${ch.id}`}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all ${
                      isActive
                        ? accentBg(currentServer)
                        : `text-neutral-500 ${accentHover(currentServer)}`
                    }`}
                  >
                    <Hash size={13} className={isActive ? "opacity-100" : "opacity-60"} />
                    <span className="truncate">{ch.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CANVAS / MOODBOARD CHANNELS */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 group">
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                Moodboards
              </span>
              <button className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-neutral-300 transition-all">
                <Plus size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {canvasChannels.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <Link
                    key={ch.id}
                    href={`/app/${activeServerId}/canvas/${ch.id}`}
                    className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-none text-xs font-semibold transition-all ${
                      isActive
                        ? accentBg(currentServer)
                        : `text-neutral-500 ${accentHover(currentServer)}`
                    }`}
                  >
                    <LayoutTemplate size={12} className={isActive ? "opacity-100" : "opacity-60"} />
                    <span className="truncate">{ch.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* User identity bar */}
        {currentUser && (
          <div className="border-t border-neutral-900 bg-black/60 px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-8 h-8 rounded-none flex items-center justify-center font-black text-black text-xs shrink-0"
                style={{ backgroundColor: currentUser.color }}
              >
                {currentUser.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-200 truncate">
                  {currentUser.username}
                </span>
                <span className="text-[9px] text-[#00ff66] font-bold tracking-widest">
                  ● online
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-neutral-500 hover:text-white rounded-none transition-colors cursor-pointer" title="Notifications">
                <Bell size={13} />
              </button>
              <button className="p-1 text-neutral-500 hover:text-white rounded-none transition-colors cursor-pointer" title="Settings">
                <Settings size={13} />
              </button>
              <button onClick={handleLogout} className="p-1 text-neutral-500 hover:text-[#ff0033] rounded-none transition-colors cursor-pointer" title="Sign out">
                <LogOut size={13} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PANE 3 — MAIN CONTENT                                              */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 bg-[#000000] flex flex-col relative overflow-hidden min-w-0">
        {/* Channel topbar — only show when inside a channel */}
        {activeChannelId && (
          <div className="h-12 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-[#050505] z-10">
            <div className="flex items-center gap-2.5">
              {isCanvasActive
                ? <LayoutTemplate size={15} style={{ color: accent(currentServer) }} />
                : <Hash size={15} style={{ color: accent(currentServer) }} />
              }
              <span className="font-black text-white text-sm uppercase tracking-tight">
                {serverChannels.find((c) => c.id === activeChannelId)?.name ?? activeChannelId}
              </span>
              <span className="hidden sm:block text-neutral-700 text-xs ml-2 border-l border-neutral-800 pl-3">
                {serverChannels.find((c) => c.id === activeChannelId)?.description}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-neutral-500 hover:text-white transition-colors" title="Pinned messages">
                <Pin size={14} />
              </button>
              <button
                className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold transition-all ${
                  membersSidebarOpen ? accentText(currentServer) : "text-neutral-500 hover:text-white"
                }`}
                onClick={() => setMembersSidebarOpen((v) => !v)}
                title="Toggle members"
              >
                <Users size={14} />
                <span className="hidden sm:inline">{serverMembers.length}</span>
              </button>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PANE 4 — MEMBERS SIDEBAR (collapsible)                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {membersSidebarOpen && activeChannelId && (
        <aside className="w-56 bg-[#080808] border-l border-neutral-900 flex flex-col shrink-0 overflow-hidden">
          <div className="h-12 border-b border-neutral-900 px-4 flex items-center">
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
              Members — {serverMembers.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-1 custom-scrollbar">
            {/* Online */}
            {serverMembers.filter((m) => m.status === "online").length > 0 && (
              <>
                <div className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest px-2 pb-1">
                  Online — {serverMembers.filter((m) => m.status === "online").length}
                </div>
                {serverMembers.filter((m) => m.status === "online").map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </>
            )}
            {/* Idle */}
            {serverMembers.filter((m) => m.status === "idle").length > 0 && (
              <>
                <div className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest px-2 pt-2 pb-1">
                  Idle — {serverMembers.filter((m) => m.status === "idle").length}
                </div>
                {serverMembers.filter((m) => m.status === "idle").map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </>
            )}
            {/* Offline */}
            {serverMembers.filter((m) => m.status === "offline").length > 0 && (
              <>
                <div className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest px-2 pt-2 pb-1">
                  Offline — {serverMembers.filter((m) => m.status === "offline").length}
                </div>
                {serverMembers.filter((m) => m.status === "offline").map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

// ─── Member row sub-component ─────────────────────────────────────────────────
function MemberRow({ member }: { member: Member }) {
  const statusColors: Record<string, string> = {
    online: "#00ff66", idle: "#f59e0b", offline: "#404040",
  };

  return (
    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-none hover:bg-white/5 cursor-pointer group transition-colors">
      <div className="relative shrink-0">
        <div
          className="w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-black text-black"
          style={{ backgroundColor: member.color }}
        >
          {member.username.slice(0, 2).toUpperCase()}
        </div>
        <div
          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#080808]"
          style={{ backgroundColor: statusColors[member.status] ?? "#404040" }}
        />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <span
            className={`text-[11px] font-bold truncate ${
              member.status === "offline" ? "text-neutral-600" : "text-neutral-200"
            }`}
          >
            {member.username}
          </span>
          {member.role === "admin" && <Crown size={9} className="text-[#f59e0b] shrink-0" />}
          {member.role === "mod" && <Shield size={9} className="text-[#6366f1] shrink-0" />}
        </div>
        {member.activity && member.status !== "offline" && (
          <span className="text-[9px] text-neutral-600 truncate">{member.activity}</span>
        )}
      </div>
    </div>
  );
}
