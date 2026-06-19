import { create } from "zustand";

export interface Server {
  id: string;
  name: string;
  icon: string;
  color: string; // "red" or "green"
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: "text" | "canvas";
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
  status: "online" | "offline";
  color: string; // accent color
  activity?: string;
}

interface NexusState {
  servers: Server[];
  channels: Record<string, Channel[]>;
  messages: Record<string, Message[]>;
  members: Record<string, Member[]>;
  currentUser: { username: string; color: string } | null;
  setCurrentUser: (user: { username: string; color: string } | null) => void;
  addMessage: (channelId: string, user: string, text: string, color: string) => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  servers: [
    { id: "nexus-prime", name: "NEXUS PRIME", icon: "Ω", color: "red" },
    { id: "sigma-cavern", name: "SIGMA CAVERN", icon: "Σ", color: "green" },
    { id: "void-direct", name: "VOID DIRECT", icon: "Ø", color: "grey" },
  ],
  channels: {
    "nexus-prime": [
      { id: "prime-gen", serverId: "nexus-prime", name: "general", type: "text" },
      { id: "prime-ann", serverId: "nexus-prime", name: "announcements", type: "text" },
      { id: "prime-shit", serverId: "nexus-prime", name: "shitpost", type: "text" },
      { id: "prime-mood", serverId: "nexus-prime", name: "mood-board", type: "canvas" },
      { id: "prime-road", serverId: "nexus-prime", name: "roadmap", type: "canvas" },
    ],
    "sigma-cavern": [
      { id: "sigma-mew", serverId: "sigma-cavern", name: "mewing-chat", type: "text" },
      { id: "sigma-looks", serverId: "sigma-cavern", name: "looksmaxxing", type: "text" },
      { id: "sigma-strat", serverId: "sigma-cavern", name: "strategy-canvas", type: "canvas" },
    ],
    "void-direct": [
      { id: "void-lounge", serverId: "void-direct", name: "lounge", type: "text" },
      { id: "void-sand", serverId: "void-direct", name: "sandbox", type: "canvas" },
    ],
  },
  messages: {
    "prime-gen": [
      { id: "1", channelId: "prime-gen", user: "system_node", text: "NEXUS PRIME ONLINE. SECURE PROTOCOLS ACTIVE.", timestamp: "12:00", color: "#ff0033" },
      { id: "2", channelId: "prime-gen", user: "giga_dev", text: "Welcome to the cinematic brutalist space. Check out the mood-board canvas channel.", timestamp: "12:02", color: "#00ff66" },
      { id: "3", channelId: "prime-gen", user: "looksmaxxer", text: "Is the infinite canvas real-time multiplayer?", timestamp: "12:05", color: "#a855f7" },
      { id: "4", channelId: "prime-gen", user: "giga_dev", text: "Yes, synced with Liveblocks provider. Open another tab to test cursors.", timestamp: "12:06", color: "#00ff66" },
    ],
    "prime-ann": [
      { id: "a1", channelId: "prime-ann", user: "NEXUS_CORE", text: "CRITICAL UPDATE: GoonBoard upgraded to NexusBoard. Absolute black enabled.", timestamp: "09:00", color: "#ff0033" },
    ],
    "prime-shit": [
      { id: "s1", channelId: "prime-shit", user: "sigmaboy_99", text: "mewing streak day 404: brain not found", timestamp: "01:15", color: "#f59e0b" },
    ],
    "sigma-mew": [
      { id: "m1", channelId: "sigma-mew", user: "looksmaxxer", text: "Shh... Mewing in progress.", timestamp: "13:00", color: "#00ff66" },
    ],
  },
  members: {
    "nexus-prime": [
      { id: "m-1", username: "giga_dev", status: "online", color: "#00ff66", activity: "Editing spatial canvas" },
      { id: "m-2", username: "looksmaxxer", status: "online", color: "#a855f7", activity: "Mewing" },
      { id: "m-3", username: "sigmaboy_99", status: "online", color: "#f59e0b", activity: "Shitposting" },
      { id: "m-4", username: "void_walker", status: "offline", color: "#737373" },
    ],
    "sigma-cavern": [
      { id: "m-2", username: "looksmaxxer", status: "online", color: "#a855f7", activity: "Mewing" },
      { id: "m-3", username: "sigmaboy_99", status: "online", color: "#f59e0b", activity: "Flexing" },
    ],
    "void-direct": [
      { id: "m-4", username: "void_walker", status: "online", color: "#737373", activity: "Staring at the void" },
    ],
  },
  currentUser: { username: "anonymous_sigma", color: "#00ff66" },
  setCurrentUser: (user) => set({ currentUser: user }),
  addMessage: (channelId, user, text, color) => set((state) => {
    const channelMessages = state.messages[channelId] || [];
    const newMessage: Message = {
      id: `${Date.now()}`,
      channelId,
      user,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color,
    };
    return {
      messages: {
        ...state.messages,
        [channelId]: [...channelMessages, newMessage],
      }
    };
  }),
}));
