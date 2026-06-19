"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGoonStore } from "@/store/nexusStore";
import { ShieldAlert, Terminal } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [accent, setAccent] = useState<"red" | "green">("green");
  const [error, setError] = useState("");

  const setCurrentUser = useGoonStore((state) => state.setCurrentUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("ERROR: USERNAME REQUIRED.");
      return;
    }
    setError("");

    setCurrentUser({
      username: username.trim(),
      color: accent === "green" ? "#00ff66" : "#ff0033",
    });

    router.push("/app/rizz-hq");
  };

  const borderClass = accent === "green" ? "border-[#00ff66]" : "border-[#ff0033]";
  const textClass = accent === "green" ? "text-[#00ff66]" : "text-[#ff0033]";
  const bgClass = accent === "green" ? "bg-[#00ff66]/10" : "bg-[#ff0033]/10";
  const hoverBtnClass = accent === "green" 
    ? "hover:bg-[#00ff66] hover:text-black focus:border-[#00ff66]" 
    : "hover:bg-[#ff0033] hover:text-black focus:border-[#ff0033]";

  return (
    <main className="min-h-screen w-screen bg-[#000000] text-neutral-100 flex flex-col items-center justify-center p-4 font-mono select-none">
      <div className={`w-full max-w-md border-2 ${borderClass} bg-black p-8 shadow-2xl relative`}>
        {/* Neon scanline accent bar */}
        <div className={`absolute top-0 left-0 w-full h-[3px] ${accent === "green" ? "bg-[#00ff66]" : "bg-[#ff0033]"}`} />
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Terminal size={18} className={textClass} />
            <span className="font-black tracking-widest text-sm uppercase">GoonBoard // Sign In</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-bold uppercase">v2.4.1</span>
        </div>

        <h1 className="text-2xl font-black tracking-tighter mb-2 uppercase flex items-center gap-2">
          <span>Authorize</span>
          <span className={textClass}>Access</span>
        </h1>
        <p className="text-xs text-neutral-500 mb-6 uppercase tracking-wider">
          Enter credentials to connect to the spatial network.
        </p>

        {error && (
          <div className={`mb-6 p-3 border ${accent === "green" ? "border-[#00ff66]/40 text-[#00ff66]" : "border-[#ff0033]/40 text-[#ff0033]"} ${bgClass} text-xs flex items-center gap-2 rounded-none`}>
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Network Handle (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-none px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-purple-500 transition-colors uppercase"
              placeholder="e.g. SIGMA_USER"
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Email Node Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-none px-4 py-3 text-sm text-neutral-100 placeholder-neutral-700 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="user@network.net"
            />
          </div>

          {/* Accent Color Picker */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Terminal Accent Profile
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAccent("green")}
                className={`py-2 px-3 border text-xs font-bold transition-all rounded-none uppercase flex items-center justify-center gap-2 cursor-pointer ${
                  accent === "green"
                    ? "border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]"
                    : "border-neutral-800 text-neutral-500 hover:border-neutral-700"
                }`}
              >
                <div className="w-2.5 h-2.5 bg-[#00ff66] shrink-0" />
                Toxic Green
              </button>
              <button
                type="button"
                onClick={() => setAccent("red")}
                className={`py-2 px-3 border text-xs font-bold transition-all rounded-none uppercase flex items-center justify-center gap-2 cursor-pointer ${
                  accent === "red"
                    ? "border-[#ff0033] bg-[#ff0033]/10 text-[#ff0033]"
                    : "border-neutral-800 text-neutral-500 hover:border-neutral-700"
                }`}
              >
                <div className="w-2.5 h-2.5 bg-[#ff0033] shrink-0" />
                Neon Red
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 border-2 ${borderClass} bg-transparent text-sm font-bold uppercase transition-all duration-150 cursor-pointer rounded-none flex items-center justify-center gap-2 ${hoverBtnClass}`}
          >
            Authorize Connection
          </button>
        </form>
      </div>

      <div className="mt-8 text-[9px] text-neutral-600 tracking-widest uppercase">
        SECURE TERMINAL // UNAUTHORIZED SHUNTING PROHIBITED
      </div>
    </main>
  );
}
