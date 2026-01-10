"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, List, Settings, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/practice", label: "Practice", icon: PlayCircle },
  { href: "/sentences", label: "Sentences", icon: List },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 hidden border-b bg-background/80 backdrop-blur-sm md:block">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <BookOpen className="h-6 w-6" />
          <span>Fluent Progress</span>
        </Link>
        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
