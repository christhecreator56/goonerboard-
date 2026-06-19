"use client";

import dynamic from "next/dynamic";
import { Sidebar } from "@/components/Sidebar";

// Disable SSR for the infinite canvas to avoid Zustand localStorage hydration and useSyncExternalStore issues during prerender
const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 h-full w-full bg-neutral-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-neutral-500 font-medium tracking-wide uppercase select-none">
          Loading Canvas...
        </span>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-neutral-900">
      {/* Sidebar (left panel) */}
      <Sidebar />

      {/* Infinite Canvas (main zone) */}
      <Canvas />
    </main>
  );
}
