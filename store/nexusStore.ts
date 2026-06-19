import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Server {
  id: string;
  name: string;
  icon: string;
  color: "red" | "green" | "purple" | "amber" | "grey";
  description?: string;
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: "text" | "canvas";
  description?: string;
}

export interface Message {
  id: string;
  channelId: string;
  user: string;
  text: string;
  timestamp: string;
  color: string;
}

export interface Member {
  id: string;
  username: string;
  status: "online" | "offline" | "idle";
  color: string;
  activity?: string;
  role?: "admin" | "mod" | "member";
}

interface GoonState {
  servers: Server[];
  channels: Record<string, Channel[]>;
  messages: Record<string, Message[]>;
  members: Record<string, Member[]>;
  currentUser: { username: string; color: string } | null;
  setCurrentUser: (user: { username: string; color: string } | null) => void;
  addMessage: (channelId: string, user: string, text: string, color: string) => void;
}

export const useGoonStore = create<GoonState>()(
  persist(
    (set) => ({
      servers: [
        {
          id: "rizz-hq",
          name: "RIZZ HQ",
          icon: "🔥",
          color: "red",
          description: "The main server. Full send.",
        },
        {
          id: "sigma-lab",
          name: "SIGMA LAB",
          icon: "⚗️",
          color: "green",
          description: "Grind, experiment, level up.",
        },
        {
          id: "the-void",
          name: "THE VOID",
          icon: "🌌",
          color: "purple",
          description: "No rules. Pure chaos canvas.",
        },
        {
          id: "my-space",
          name: "MY SPACE",
          icon: "🧠",
          color: "amber",
          description: "Your private moodboard & notes.",
        },
      ],

      channels: {
        "rizz-hq": [
          { id: "rizz-general",      serverId: "rizz-hq",    name: "general",        type: "text",   description: "Main chat" },
          { id: "rizz-announcements",serverId: "rizz-hq",    name: "announcements",  type: "text",   description: "Big moves only" },
          { id: "rizz-shitpost",     serverId: "rizz-hq",    name: "shitpost",       type: "text",   description: "Zero filter zone" },
          { id: "rizz-moodboard",    serverId: "rizz-hq",    name: "moodboard",      type: "canvas", description: "Shared vision board" },
          { id: "rizz-roadmap",      serverId: "rizz-hq",    name: "roadmap",        type: "canvas", description: "Where are we going" },
        ],
        "sigma-lab": [
          { id: "lab-grind",         serverId: "sigma-lab",  name: "grind-log",      type: "text",   description: "Daily grind updates" },
          { id: "lab-strats",        serverId: "sigma-lab",  name: "strats",         type: "text",   description: "Alpha only" },
          { id: "lab-canvas",        serverId: "sigma-lab",  name: "experiment-board", type: "canvas", description: "R&D moodboard" },
        ],
        "the-void": [
          { id: "void-chat",         serverId: "the-void",   name: "speak-to-void",  type: "text",   description: "It listens." },
          { id: "void-canvas",       serverId: "the-void",   name: "void-canvas",    type: "canvas", description: "Infinite dark space" },
        ],
        "my-space": [
          { id: "private-journal",   serverId: "my-space",   name: "journal",        type: "text",   description: "Private thoughts" },
          { id: "private-canvas",    serverId: "my-space",   name: "my-moodboard",   type: "canvas", description: "Personal workspace" },
          { id: "private-ideas",     serverId: "my-space",   name: "ideas-dump",     type: "canvas", description: "Unfiltered ideas" },
        ],
      },

      messages: {
        "rizz-general": [
          { id: "1", channelId: "rizz-general", user: "system", text: "🔥 RIZZ HQ IS LIVE. WELCOME TO THE SPACE.", timestamp: "00:00", color: "#ff0033" },
          { id: "2", channelId: "rizz-general", user: "giga_dev", text: "what's the vibe today?", timestamp: "09:14", color: "#00ff66" },
          { id: "3", channelId: "rizz-general", user: "looksmaxxer", text: "built different fr fr. check the moodboard channel", timestamp: "09:16", color: "#a855f7" },
          { id: "4", channelId: "rizz-general", user: "sigmaboy_99", text: "bro the canvas is actually fire. dragged like 10 nodes already", timestamp: "09:20", color: "#f59e0b" },
          { id: "5", channelId: "rizz-general", user: "giga_dev", text: "yes you can see other people's cursors move in real time too", timestamp: "09:21", color: "#00ff66" },
        ],
        "rizz-announcements": [
          { id: "a1", channelId: "rizz-announcements", user: "ADMIN", text: "🚨 GoonBoard v2 dropped. Brutalist aesthetic locked in. Canvas is spatial. Chat is fire.", timestamp: "08:00", color: "#ff0033" },
        ],
        "rizz-shitpost": [
          { id: "s1", channelId: "rizz-shitpost", user: "sigmaboy_99", text: "mewing so hard my jaw is a separate entity", timestamp: "02:45", color: "#f59e0b" },
          { id: "s2", channelId: "rizz-shitpost", user: "looksmaxxer", text: "💀💀💀", timestamp: "02:46", color: "#a855f7" },
        ],
        "lab-grind": [
          { id: "g1", channelId: "lab-grind", user: "grinder_x", text: "Day 47 of no distractions. Canvas nodes organized. Mind clear.", timestamp: "06:00", color: "#00ff66" },
        ],
        "void-chat": [
          { id: "v1", channelId: "void-chat", user: "void_walker", text: "...", timestamp: "??:??", color: "#6366f1" },
        ],
        "private-journal": [
          { id: "j1", channelId: "private-journal", user: "you", text: "This is your private space. No one else can read this.", timestamp: "now", color: "#f59e0b" },
        ],
      },

      members: {
        "rizz-hq": [
          { id: "m-1", username: "giga_dev",     status: "online",  color: "#00ff66",  activity: "Building the canvas",  role: "admin" },
          { id: "m-2", username: "looksmaxxer",  status: "online",  color: "#a855f7",  activity: "Mewing",               role: "mod" },
          { id: "m-3", username: "sigmaboy_99",  status: "online",  color: "#f59e0b",  activity: "Shitposting",          role: "member" },
          { id: "m-4", username: "void_walker",  status: "idle",    color: "#6366f1",  activity: "Staring at the void",  role: "member" },
          { id: "m-5", username: "grinder_x",    status: "offline", color: "#737373",                                    role: "member" },
        ],
        "sigma-lab": [
          { id: "m-1", username: "giga_dev",    status: "online",  color: "#00ff66", activity: "Experimenting",         role: "admin" },
          { id: "m-2", username: "looksmaxxer", status: "online",  color: "#a855f7", activity: "Optimizing jaw angle",  role: "member" },
          { id: "m-3", username: "grinder_x",   status: "online",  color: "#737373", activity: "Day 47 grind",          role: "member" },
        ],
        "the-void": [
          { id: "m-4", username: "void_walker", status: "online",  color: "#6366f1", activity: "Existing",              role: "admin" },
        ],
        "my-space": [
          { id: "me", username: "you",           status: "online",  color: "#f59e0b", activity: "Creating",              role: "admin" },
        ],
      },

      currentUser: { username: "you", color: "#f59e0b" },

      setCurrentUser: (user) => set({ currentUser: user }),

      addMessage: (channelId, user, text, color) =>
        set((state) => {
          const prev = state.messages[channelId] || [];
          const newMsg: Message = {
            id: `${Date.now()}`,
            channelId,
            user,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            color,
          };
          return {
            messages: {
              ...state.messages,
              [channelId]: [...prev, newMsg],
            },
          };
        }),
    }),
    {
      name: "goonboard-store",
      // Only persist messages so servers/channels stay fresh from defaults
      partialize: (state) => ({ messages: state.messages, currentUser: state.currentUser }),
    }
  )
);

// Backwards compat alias for anything still using the old name
export const useNexusStore = useGoonStore;
