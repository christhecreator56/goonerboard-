"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGoonStore } from "@/store/nexusStore";
import { Send, SmilePlus, AtSign, Image as ImageIcon } from "lucide-react";

const botUsers = [
  { name: "giga_dev",    color: "#00ff66" },
  { name: "sigmaboy_99", color: "#00ff66" },
  { name: "looksmaxxer", color: "#00ff66" },
  { name: "void_walker", color: "#00ff66" },
];

const botReplies = [
  "based", "fr fr no cap", "💀", "bro really said that",
  "on god", "sheesh", "ngl that slaps", "W move", "ratio + L",
  "actual behavior", "respectfully, skill issue",
  "let him cook", "bruh", "LMAO", "cope harder",
];

export default function TextChannelPage() {
  const params = useParams();
  const serverId  = (params?.serverId  as string) || "rizz-hq";
  const channelId = (params?.channelId as string) || "rizz-general";

  const { channels, messages, addMessage, currentUser } = useGoonStore();

  const currentChannel = channels[serverId]?.find((c) => c.id === channelId) ?? {
    id: channelId, name: "general", serverId, type: "text" as const, description: "",
  };

  const channelMessages = messages[channelId] ?? [];
  const [inputText, setInputText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const color = "#00ff66";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    addMessage(channelId, currentUser.username, inputText.trim(), currentUser.color);
    setInputText("");

    // Simulate a reply from a random bot
    setTimeout(() => {
      const bot   = botUsers[Math.floor(Math.random() * botUsers.length)];
      const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
      addMessage(channelId, bot.name, reply, bot.color);
    }, 900 + Math.random() * 800);
  };

  // Group consecutive messages from the same author
  const grouped = channelMessages.reduce<Array<{
    user: string; color: string; time: string; texts: string[]; id: string;
  }>>((acc, msg) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.user === msg.user) {
      prev.texts.push(msg.text);
    } else {
      acc.push({ user: msg.user, color: msg.color, time: msg.timestamp, texts: [msg.text], id: msg.id });
    }
    return acc;
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#000000] font-sans overflow-hidden">

      {/* Messages feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-0.5 custom-scrollbar">
        {grouped.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div
              className="w-16 h-16 rounded-none flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
            >
              #
            </div>
            <div>
              <div className="font-black text-white text-lg">#{currentChannel.name}</div>
              <div className="text-xs text-neutral-600 mt-1">
                {currentChannel.description || "Start the conversation."}
              </div>
            </div>
          </div>
        )}

        {grouped.map((group) => {
          const isMe = group.user === currentUser?.username;
          return (
            <div key={group.id} className="group flex items-start gap-3 py-1 px-2 hover:bg-white/[0.02] rounded-none transition-colors">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-none flex items-center justify-center text-xs font-black text-black shrink-0 mt-0.5"
                style={{ backgroundColor: group.color }}
              >
                {group.user.slice(0, 2).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className="text-sm font-bold"
                    style={{ color: isMe ? currentUser?.color ?? group.color : group.color }}
                  >
                    {group.user}
                  </span>
                  <span className="text-[10px] text-neutral-700 font-mono">{group.time}</span>
                </div>
                {group.texts.map((text, i) => (
                  <p key={i} className="text-sm text-neutral-300 leading-relaxed break-words">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-[#111111] border border-neutral-800 focus-within:border-neutral-600 transition-colors"
          style={{ boxShadow: `0 0 0 0 ${color}` }}
        >
          {/* Attachment-style icons */}
          <div className="flex items-center gap-0.5 px-3">
            <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-400 transition-colors" aria-label="Attach image">
              <ImageIcon size={16} aria-hidden="true" />
            </button>
            <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-400 transition-colors">
              <AtSign size={16} />
            </button>
          </div>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent py-3.5 text-sm text-neutral-200 placeholder-neutral-700 focus:outline-none"
            placeholder={`Message #${currentChannel.name}`}
          />

          {/* Emoji + send */}
          <div className="flex items-center gap-1 px-3">
            <button type="button" className="p-1.5 text-neutral-600 hover:text-neutral-400 transition-colors">
              <SmilePlus size={16} />
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              style={{ color: inputText.trim() ? color : undefined }}
              title="Send"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
        <div className="text-[10px] text-neutral-800 mt-1.5 px-1 font-mono">
          Return to send · Shift+Return for new line
        </div>
      </div>
    </div>
  );
}
