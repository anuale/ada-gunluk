"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Moon,
  Baby,
  Droplets,
  Lightbulb,
  Syringe,
} from "lucide-react";
import { formatDuration, formatTimeAgo } from "@/components/tracking/timer";

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: string | null;
}

interface DailyLog {
  id: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  data: Record<string, unknown> | null;
}

export default function DashboardPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then((data) => {
        if (data.children?.length > 0) {
          const c = data.children[0];
          setChild(c);
          const today = new Date().toISOString().split("T")[0];
          return fetch(`/api/daily-logs?childId=${c.id}&date=${today}`);
        }
      })
      .then((r) => r?.json())
      .then((data) => setLogs(data || []))
      .catch(() => {});
  }, []);

  const age = child ? getAge(new Date(child.birthDate)) : null;

  const lastFeeding = logs.find((l) => l.type === "feeding");
  const lastSleep = logs.find((l) => l.type === "sleep");

  const getLogSummary = (log: DailyLog): string => {
    const d = log.data;
    if (!d) return "";
    if (log.type === "feeding") {
      const ft = d.feedType as string;
      if (ft === "breast") return `Anne Sütü • ${Math.floor(((d.leftDuration as number) || 0 + (d.rightDuration as number) || 0) / 60000)} dk`;
      if (ft === "formula") return `Formül • ${d.amount || "—"} ml`;
      return `Ek Gıda • ${d.amount || "—"}`;
    }
    if (log.type === "sleep" && log.startedAt && log.endedAt) {
      const dur = new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime();
      return formatDuration(dur);
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <section className="bg-primary-container text-on-primary-container rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
          <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="relative z-10">
          {child ? (
            <>
              <h2 className="font-serif text-xl md:text-2xl mb-1">
                {child.name} bugün {age}
              </h2>
              <p className="text-sm opacity-90">
                Harika gidiyorsun! Bugün neler yaptınız?
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-xl md:text-2xl mb-1">
                Ada&apos;nın Günlüğü&apos;ne Hoş Geldiniz
              </h2>
              <p className="text-sm opacity-90">
                Başlamak için bir çocuk profili ekleyin.
              </p>
            </>
          )}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction
            href="/timeline?log=feeding"
            icon={UtensilsCrossed}
            label="Beslenme"
            bg="bg-feeding text-feeding-text"
          />
          <QuickAction
            href="/timeline?log=sleep"
            icon={Moon}
            label="Uyku"
            bg="bg-sleep text-sleep-text"
          />
          <QuickAction
            href="/timeline?log=diaper"
            icon={Baby}
            label="Alt Değiştirme"
            bg="bg-diaper text-diaper-text"
          />
          <QuickAction
            href="/timeline?log=ec"
            icon={Droplets}
            label="Tuvalet"
            bg="bg-ec text-ec-text"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <article className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-on-surface">
                Bugünün Özeti
              </h3>
              <Link
                href="/timeline"
                className="text-primary text-sm font-medium hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>
            {logs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-on-surface-variant">
                  Henüz bugün için kayıt yok. İlk kaydınızı ekleyin!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lastFeeding && (
                  <SummaryItem
                    bg="bg-feeding text-feeding-text"
                    icon={UtensilsCrossed}
                    title="Son Beslenme"
                    detail={getLogSummary(lastFeeding)}
                    time={formatTimeAgo(new Date(lastFeeding.startedAt))}
                  />
                )}
                {lastSleep && (
                  <SummaryItem
                    bg="bg-sleep text-sleep-text"
                    icon={Moon}
                    title="Son Uyku"
                    detail={getLogSummary(lastSleep)}
                    time={formatTimeAgo(new Date(lastSleep.startedAt))}
                  />
                )}
                {!lastFeeding && !lastSleep && (
                  <p className="text-sm text-center text-on-surface-variant py-3">
                    Beslenme veya uyku kaydı bulunamadı
                  </p>
                )}
              </div>
            )}
          </article>

          <article className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <h3 className="font-serif text-lg text-on-surface mb-4">
              Haftalık Gelişim
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="70, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-2xl text-on-surface">
                    —
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    Yakında
                  </span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                <p className="text-sm text-on-surface-variant text-center py-2">
                  Gelişim takibi Faz 3&apos;te aktif olacak.
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <aside className="bg-amber-50/80 rounded-2xl p-6 shadow-sm border border-amber-900/5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={20} className="text-amber-700" />
              <h3 className="font-serif text-lg text-amber-900">
                Bugünün Önerisi
              </h3>
            </div>
            <blockquote className="text-sm text-amber-900/80 italic leading-relaxed mb-3">
              &ldquo;{child?.name || "Bebeğiniz"} ile bol bol konuşun. Her gün duyduğu kelime sayısı, dil gelişiminin temelini oluşturur. Yaptığınız her şeyi anlatın.&rdquo;
            </blockquote>
            <span className="text-xs text-amber-800/70 font-medium">
              30 Milyon Kelime — Dana Suskind
            </span>
          </aside>

          <aside className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <Syringe size={20} className="text-primary" />
              <h3 className="font-serif text-lg text-on-surface">
                Yaklaşan Aşılar
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Aşı takvimi çocuk profili oluşturulduktan sonra görüntülenecek.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  bg,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors border border-transparent hover:border-primary/20 group"
    >
      <div
        className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-on-surface">{label}</span>
    </Link>
  );
}

function SummaryItem({
  bg,
  icon: Icon,
  title,
  detail,
  time,
}: {
  bg: string;
  icon: React.ElementType;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
      <div
        className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant">{detail}</p>
      </div>
      <span className="text-xs text-on-surface-variant">{time}</span>
    </div>
  );
}

function getAge(birthDate: Date): string {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  const days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} yıl ${months} ay ${Math.abs(days)} günlük`;
  }
  if (months > 0) {
    return `${months} ay ${Math.abs(days)} günlük`;
  }
  return `${Math.abs(days)} günlük`;
}
