"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/rizz-hq");
  }, [router]);

  return null;
}
