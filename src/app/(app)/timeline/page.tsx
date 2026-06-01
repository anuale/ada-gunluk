"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UtensilsCrossed,
  Moon,
  Baby,
  Droplets,
  Play,
  Plus,
  Sparkles,
  Pencil,
} from "lucide-react";
import { LogForm } from "@/components/tracking/log-form";
import { formatDuration } from "@/components/tracking/timer";
import { EndOfDayReflection } from "@/components/tracking/reflection";
import toast from "react-hot-toast";

interface DailyLog {
  id: string;
  childId: string;
  type: "feeding" | "sleep" | "diaper" | "ec";
  logDate: string;
  startedAt: string;
  endedAt: string | null;
  data: Record<string, unknown> | null;
  notes: string | null;
  user: { name: string };
}

export default function TimelinePage() {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelinePageInner />
    </Suspense>
  );
}

function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary animate-pulse bg-surface-container-highest rounded h-8 w-24" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl p-5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-container-highest rounded w-24" />
                <div className="h-3 bg-surface-container-highest rounded w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelinePageInner() {
  const searchParams = useSearchParams();
  const initialLogType = searchParams.get("log") as "feeding" | "sleep" | "diaper" | "ec" | null;

  const [childId, setChildId] = useState<string | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [logType, setLogType] = useState<"feeding" | "sleep" | "diaper" | "ec">("feeding");
  const [showReflection, setShowReflection] = useState(false);
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null);

  const fetchChild = useCallback(async () => {
    try {
      const res = await fetch("/api/children");
      if (res.ok) {
        const data = await res.json();
        if (data.children?.length > 0) {
          setChildId(data.children[0].id);
          return data.children[0].id;
        }
      }
    } catch {
      // ignore
    }
    return null;
  }, []);

  const fetchLogs = useCallback(async (cid: string) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const res = await fetch(`/api/daily-logs?childId=${cid}&date=${today}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      toast.error("Veriler yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChild().then((cid) => {
      if (cid) fetchLogs(cid);
      else setLoading(false);
    });
  }, [fetchChild, fetchLogs]);

  useEffect(() => {
    if (initialLogType) {
      setLogType(initialLogType);
      setShowLogForm(true);
    }
  }, [initialLogType]);

  const handleOpenLog = (type: "feeding" | "sleep" | "diaper" | "ec") => {
    setLogType(type);
    setEditingLog(null);
    setShowLogForm(true);
    setShowFabMenu(false);
  };

  const handleSaved = () => {
    if (childId) fetchLogs(childId);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "feeding": return UtensilsCrossed;
      case "sleep": return Moon;
      case "diaper": return Baby;
      case "ec": return Droplets;
      default: return Play;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "feeding": return "bg-feeding text-feeding-text";
      case "sleep": return "bg-sleep text-sleep-text";
      case "diaper": return "bg-diaper text-diaper-text";
      case "ec": return "bg-ec text-ec-text";
      default: return "bg-surface-container-low text-on-surface-variant";
    }
  };

  const getLogLabel = (type: string) => {
    switch (type) {
      case "feeding": return "Beslenme";
      case "sleep": return "Uyku";
      case "diaper": return "Alt Değiştirme";
      case "ec": return "Tuvalet";
      default: return type;
    }
  };

  const getLogDetail = (log: DailyLog) => {
    const d = log.data;
    if (!d) return <span className="text-xs text-on-surface-variant mt-1">{log.notes || ""}</span>;

    switch (log.type) {
      case "feeding": {
        const ft = (d.feedType as string) || "breast";
        return (
          <div className="flex flex-wrap gap-x-2 text-xs text-on-surface-variant mt-1">
            {ft === "breast" ? (
              <>
                <span>Anne Sütü</span>
                <span>Sol: {Math.floor(((d.leftDuration as number) || 0) / 60000)} dk</span>
                <span>Sağ: {Math.floor(((d.rightDuration as number) || 0) / 60000)} dk</span>
              </>
            ) : ft === "formula" ? (
              <span>Formül • {(d.amount as string) || "—"} ml</span>
            ) : (
              <span>Ek Gıda • {(d.amount as string) || "—"}</span>
            )}
          </div>
        );
      }
      case "sleep": {
        const dur = log.startedAt && log.endedAt ? new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime() : 0;
        const q = (d.quality as number) || 3;
        const loc = d.location as string;
        const fa = d.fallAsleep as string;
        const locMap: Record<string, string> = { crib: "Beşik", parents_bed: "Ebeveyn yatağı", stroller: "Bebek arabası", car_seat: "Araba koltuğu" };
        const faMap: Record<string, string> = { self: "Kendi kendine", breastfeeding: "Emzirerek", rocking: "Sallanarak", other: "Diğer" };
        return (
          <div className="flex flex-wrap gap-x-2 text-xs text-on-surface-variant mt-1">
            {dur > 0 && <span>{formatDuration(dur)}</span>}
            <span>{"⭐".repeat(q)}</span>
            {loc && <span>{locMap[loc] || loc}</span>}
            {fa && <span>{faMap[fa] || fa}</span>}
          </div>
        );
      }
      case "diaper": {
        const dt = (d.diaperType as string) || "wet";
        const col = d.color as string;
        const con = d.consistency as string;
        const colMap: Record<string, string> = { yellow: "Sarı", green: "Yeşil", brown: "Kahverengi", dark_green: "Koyu Yeşil", mustard: "Hardal" };
        const conMap: Record<string, string> = { liquid: "Sıvı", soft: "Yumuşak", formed: "Şekilli", hard: "Sert", seedy: "Tanecikli" };
        return (
          <div className="flex flex-wrap gap-x-2 text-xs text-on-surface-variant mt-1">
            <span>{dt === "wet" ? "Islak" : dt === "dirty" ? "Kaka" : "Islak + Kaka"}</span>
            {col && <span>Renk: {colMap[col] || col}</span>}
            {con && <span>Kıvam: {conMap[con] || con}</span>}
          </div>
        );
      }
      case "ec": {
        const cue = d.cue as string;
        const pos = d.position as string;
        const posMap: Record<string, string> = { sink: "Lavabo", toilet: "Klozet", adapter: "Tuvalet adaptörü", potty: "Lazımlık", outside: "Dışarıda" };
        return (
          <div className="flex flex-wrap gap-x-2 text-xs text-on-surface-variant mt-1">
            <span>{(d.success as boolean) ? "✅ Başarılı" : "❌ Kaçırma"}</span>
            {cue && <span>İşaret: {cue}</span>}
            {pos && <span>{posMap[pos] || pos}</span>}
          </div>
        );
      }
      default: return null;
    }
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const label = new Date(log.startedAt).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    if (!acc[label]) acc[label] = [];
    acc[label].push(log);
    return acc;
  }, {} as Record<string, DailyLog[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary">Günlük</h1>
        <button
          onClick={() => setShowReflection(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:bg-primary-container/30 px-3 py-1.5 rounded-full transition-colors"
        >
          <Sparkles size={16} />
          Gün Sonu
        </button>
      </div>

      {!childId && !loading ? (
        <div className="bg-surface rounded-2xl p-12 shadow-sm border border-outline-variant/10 text-center">
          <Plus size={28} className="text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-on-surface mb-2">Önce bir çocuk profili ekleyin</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Günlük takip için bir çocuk profili oluşturmalısınız.
          </p>
          <Link
            href="/children/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
          >
            <Plus size={16} />
            Çocuk Ekle
          </Link>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container-highest rounded w-24" />
                  <div className="h-3 bg-surface-container-highest rounded w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 shadow-sm border border-outline-variant/10 text-center">
          <button
            onClick={() => setShowFabMenu(true)}
            className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4 hover:bg-primary-container/80 transition-colors active:scale-95"
          >
            <Plus size={28} />
          </button>
          <h2 className="font-serif text-lg text-on-surface mb-2">
            Bugün için henüz kayıt yok
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Yeni kayıt eklemek için butona dokunun.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedLogs).map(([date, dateLogs]) => (
            <div key={date}>
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1 mb-2">{date}</h3>
              <div className="space-y-2">
                {dateLogs.map((log) => {
                  const Icon = getLogIcon(log.type);
                  const color = getLogColor(log.type);
                  return (
                    <div
                      key={log.id}
                      className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/10 flex items-start gap-3"
                    >
                      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-on-surface">{getLogLabel(log.type)}</h3>
                        </div>
                        {getLogDetail(log)}
                        {log.notes && (
                          <p className="text-xs text-on-surface-variant/60 mt-1 italic">&ldquo;{log.notes}&rdquo;</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setLogType(log.type);
                            setEditingLog(log);
                            setShowLogForm(true);
                          }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-low transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <span className="text-xs text-on-surface-variant/50">
                          {new Date(log.startedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      <FAB onSelect={handleOpenLog} open={showFabMenu} onToggle={() => setShowFabMenu(!showFabMenu)} />

      {showLogForm && childId && (
        <LogForm
          type={logType}
          childId={childId}
          onClose={() => { setShowLogForm(false); setEditingLog(null); }}
          onSaved={handleSaved}
          existingLog={editingLog || undefined}
        />
      )}

      {showReflection && childId && (
        <EndOfDayReflection
          childId={childId}
          onClose={() => setShowReflection(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

function FAB({
  onSelect,
  open,
  onToggle,
}: {
  onSelect: (type: "feeding" | "sleep" | "diaper" | "ec") => void;
  open: boolean;
  onToggle: () => void;
}) {
  const items = [
    { type: "feeding" as const, label: "Beslenme", icon: UtensilsCrossed, color: "bg-feeding text-feeding-text" },
    { type: "sleep" as const, label: "Uyku", icon: Moon, color: "bg-sleep text-sleep-text" },
    { type: "diaper" as const, label: "Alt Değiştirme", icon: Baby, color: "bg-diaper text-diaper-text" },
    { type: "ec" as const, label: "Tuvalet", icon: Droplets, color: "bg-ec text-ec-text" },
  ];

  return (
    <div className="fixed bottom-24 md:bottom-8 right-5 md:right-10 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="flex flex-col gap-2 mb-2 animate-slide-up">
          {items.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelect(item.type)}
              className="flex items-center gap-3 bg-surface shadow-lg rounded-full pl-4 pr-5 py-2.5 hover:bg-surface-container-low transition-all active:scale-95"
            >
              <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center`}>
                <item.icon size={16} />
              </div>
              <span className="text-sm font-medium text-on-surface">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90 ${
          open
            ? "bg-error-container text-on-error-container rotate-45"
            : "bg-primary text-on-primary"
        }`}
      >
        <Plus size={26} />
      </button>
    </div>
  );
}
