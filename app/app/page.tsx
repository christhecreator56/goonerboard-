"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/nexus-prime");
  }, [router]);

  return (
    <div className="flex-1 bg-[#000000] flex items-center justify-center font-mono">
      <div className="text-xs text-neutral-500 uppercase tracking-widest animate-pulse">
        CONNECTING TO CORE PROTOCOL...
      </div>
    </div>
  );
}
