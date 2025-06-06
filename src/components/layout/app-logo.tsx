"use client";

import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-sidebar-primary hover:text-sidebar-primary/90 transition-colors">
      <Stethoscope className="h-7 w-7 text-primary" />
      <span className="font-headline">ScoreDoc</span>
    </Link>
  );
}
