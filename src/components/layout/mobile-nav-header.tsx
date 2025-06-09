
"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AppLogo from "./app-logo"; // Optional: if you want to show the logo in mobile header
import Link from "next/link";

export default function MobileNavHeader() {
  const { isMobile } = useSidebar();

  if (!isMobile) {
    return null; // This component is only for mobile view
  }

  return (
    <div className="md:hidden flex items-center justify-between p-3 border-b bg-background sticky top-0 z-20 h-14">
      <SidebarTrigger aria-label="Toggle sidebar" />
      {/* You can add a logo or title here if desired for the mobile top bar */}
      {/* <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <AppLogo />
      </Link> */}
      {/* Placeholder for other potential mobile header items, like a user icon */}
      <div></div>
    </div>
  );
}
