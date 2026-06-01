"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  CalendarDays,
  TrendingUp,
  Sparkles,
  NotebookPen,
  FileText,
  Settings,
  Plus,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Ana Sayfa", icon: House },
  { href: "/timeline", label: "Günlük", icon: CalendarDays },
  { href: "/development", label: "Gelişim", icon: TrendingUp },
  { href: "/assistant", label: "Asistan", icon: Sparkles },
  { href: "/notes", label: "Notlar", icon: NotebookPen },
  { href: "/reports", label: "Raporlar", icon: FileText },
  { href: "/settings", label: "Ayarlar", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 z-40 h-screen w-64 bg-surface-container-low rounded-r-2xl shadow-sm border-r border-outline-variant/20 p-6">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xl font-serif text-primary">
          Ada&apos;nın Günlüğü
        </Link>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
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

      <Link
        href="/timeline?log=new"
        className="flex items-center justify-center gap-2 bg-primary text-on-primary text-sm font-medium py-3 rounded-full hover:bg-surface-tint transition-colors shadow-sm mt-4"
      >
        <Plus size={18} />
        <span>Yeni Kayıt</span>
      </Link>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const mobileItems = [
    { href: "/dashboard", label: "Ana Sayfa", icon: House },
    { href: "/timeline", label: "Günlük", icon: CalendarDays },
    { href: "/assistant", label: "Asistan", icon: Sparkles },
    { href: "/settings", label: "Ayarlar", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0.5rem)+0.5rem)] bg-surface shadow-lg rounded-t-2xl border-t border-outline-variant/10">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 transition-all active:scale-90 ${
              isActive
                ? "text-primary"
                : "text-on-surface-variant/70 hover:text-on-surface-variant"
            }`}
          >
            {isActive && (
              <div className="w-6 h-1 bg-primary rounded-full -mt-1 mb-0.5" />
            )}
            <Icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}

      <Link
        href="/timeline?log=new"
        className="flex flex-col items-center justify-center -mt-5"
      >
        <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Plus size={24} />
        </div>
        <span className="text-[10px] font-medium text-on-surface-variant mt-0.5">
          Kayıt
        </span>
      </Link>

      {mobileItems.length > 4 && mobileItems.slice(2).map(() => null)}
    </nav>
  );
}
