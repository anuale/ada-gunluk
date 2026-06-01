"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Bell, UserCircle } from "lucide-react";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center px-5 md:px-10 py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="md:hidden">
        <Link href="/dashboard" className="text-lg font-serif text-primary">
          Ada&apos;nın Günlüğü
        </Link>
      </div>
      <div className="hidden md:block flex-1" />

      <div className="flex items-center gap-2">
        <span className="text-sm text-on-surface-variant mr-2 hidden sm:block">
          {session?.user?.name}
        </span>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95">
          <Bell size={20} />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95"
        >
          <UserCircle size={20} />
        </button>
      </div>
    </header>
  );
}
