"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Bell, UserCircle, Menu, X } from "lucide-react";
import {
  House,
  CalendarDays,
  TrendingUp,
  Sparkles,
  NotebookPen,
  FileText,
  Settings,
} from "lucide-react";

const mobileNavItems = [
  { href: "/dashboard", label: "Ana Sayfa", icon: House },
  { href: "/timeline", label: "Günlük", icon: CalendarDays },
  { href: "/development", label: "Gelişim", icon: TrendingUp },
  { href: "/assistant", label: "Asistan", icon: Sparkles },
  { href: "/notes", label: "Notlar", icon: NotebookPen },
  { href: "/reports", label: "Raporlar", icon: FileText },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function TopBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 flex justify-between items-center px-5 md:px-10 py-4 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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

      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface shadow-xl animate-slide-in-left">
            <div className="p-6 border-b border-outline-variant/10">
              <Link href="/dashboard" className="text-xl font-serif text-primary" onClick={() => setMenuOpen(false)}>
                Ada&apos;nın Günlüğü
              </Link>
              {session?.user?.name && (
                <p className="text-sm text-on-surface-variant mt-1">{session.user.name}</p>
              )}
            </div>
            <nav className="p-3 space-y-1">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-container text-on-primary-container"
                        : "text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant/10">
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                className="w-full py-3 rounded-full border border-outline-variant text-on-surface-variant text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
