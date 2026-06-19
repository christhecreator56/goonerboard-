"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useNexusStore, type Server, type Channel } from "@/store/nexusStore";
import { Hash, Send, Sparkles, Terminal } from "lucide-react";

export default function TextChannelPage() {
  const params = useParams();
  const serverId = (params?.serverId as string) || "nexus-prime";
  const channelId = (params?.channelId as string) || "prime-gen";

  const { servers, channels, messages, addMessage, currentUser } = useNexusStore();

  const currentServer = servers.find((s) => s.id === serverId) || servers[0];
  const currentChannel = channels[serverId]?.find((c) => c.id === channelId) || {
    id: channelId,
    name: "general",
    serverId,
    type: "text" as const,
  };

  const channelMessages = messages[channelId] || [];

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [channelMessages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    // Send user message
    addMessage(channelId, currentUser.username, inputText.trim(), currentUser.color);
    setInputText("");

    // Simulate response with a small delay
    setTimeout(() => {
      const responses = [
        "PROTOCOL NOTED. COMMITTING TRANSACTIONS.",
        "BASED. LET'S FOCUS ON THE SPATIAL CANVAS NOW.",
        "MEWING IN PROGRESS. DO NOT INTERRUPT THE STREAK.",
        "AFFIRMATIVE. STACK IS COMPILED SUCCESSFULLY.",
        "VOID STARE INITIATED.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const botUsers = [
        { name: "giga_dev", color: "#00ff66" },
        { name: "sigmaboy_99", color: "#f59e0b" },
        { name: "NEXUS_CORE", color: "#ff0033" },
      ];
      const randomBot = botUsers[Math.floor(Math.random() * botUsers.length)];

      addMessage(channelId, randomBot.name, randomResponse, randomBot.color);
    }, 1200);
  };

  const borderClass = currentServer.color === "red" ? "border-[#ff0033]" : currentServer.color === "green" ? "border-[#00ff66]" : "border-neutral-800";
  const textClass = currentServer.color === "red" ? "text-[#ff0033]" : currentServer.color === "green" ? "text-[#00ff66]" : "text-neutral-400";
  const btnHoverClass = currentServer.color === "red" ? "hover:bg-[#ff0033] hover:text-black focus:border-[#ff0033]" : currentServer.color === "green" ? "hover:bg-[#00ff66] hover:text-black focus:border-[#00ff66]" : "hover:bg-neutral-500 hover:text-black focus:border-neutral-500";

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] font-mono select-none">
      {/* Channel Header Info */}
      <div className="h-14 border-b border-neutral-900 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Hash size={16} className={textClass} />
          <span className="font-black text-neutral-100 uppercase tracking-tight">
            {currentChannel.name}
          </span>
          <span className="text-neutral-700 mx-2">|</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
            RAW CHAT STREAM
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
          <Terminal size={10} className="text-[#00ff66]" /> Live Connection Established
        </div>
      </div>

      {/* Messages Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 custom-scrollbar">
        {channelMessages.map((msg) => (
          <div key={msg.id} className="text-xs leading-relaxed hover:bg-neutral-900/20 px-2 py-1 transition-colors flex items-start gap-1">
            <span className="text-neutral-600 shrink-0 select-none">[{msg.timestamp}]</span>
            <span
              className="font-bold shrink-0 uppercase select-none mr-1.5"
              style={{ color: msg.color }}
            >
              {msg.user}:
            </span>
            <span className="text-neutral-300 break-all">{msg.text}</span>
          </div>
        ))}
        {channelMessages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-700 text-xs italic">
            NO LOGGED TRANSMISSIONS IN THIS FEED.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-neutral-900 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#030303] border border-neutral-800 rounded-none px-4 py-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-purple-600 transition-colors uppercase"
              placeholder={`Transmit packet to #${currentChannel.name}...`}
            />
            <div className="absolute right-3 flex items-center gap-1 text-[9px] text-neutral-600 font-bold tracking-widest uppercase pointer-events-none">
              <Sparkles size={10} className="text-purple-500" /> WebRTC Synced
            </div>
          </div>
          <button
            type="submit"
            className={`border px-6 py-3.5 text-xs font-bold uppercase transition-all duration-150 rounded-none flex items-center gap-2 cursor-pointer ${borderClass} ${textClass} ${btnHoverClass}`}
          >
            <Send size={12} />
            Transmit
          </button>
        </form>
      </div>
    </div>
  );
}
