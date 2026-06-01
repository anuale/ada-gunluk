"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  UtensilsCrossed,
  Moon,
  Baby,
  Droplets,
  Play,
  Plus,
  Sparkles,
} from "lucide-react";
import { LogForm } from "@/components/tracking/log-form";
import { formatDuration, formatTimeAgo } from "@/components/tracking/timer";
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

  const getLogSummary = (log: DailyLog): string => {
    const d = log.data;
    if (!d) return log.notes || "";

    switch (log.type) {
      case "feeding": {
        const ft = d.feedType as string;
        if (ft === "breast") {
          const l = (d.leftDuration as number) || 0;
          const r = (d.rightDuration as number) || 0;
          return `Anne Sütü • ${Math.floor((l + r) / 60000)} dk`;
        }
        if (ft === "formula") return `Formül • ${d.amount || "—"} ml`;
        return `Ek Gıda • ${d.amount || "—"}`;
      }
      case "sleep": {
        if (log.startedAt && log.endedAt) {
          const duration = new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime();
          return `${formatDuration(duration)} • Kalite: ${"⭐".repeat((d.quality as number) || 3)}`;
        }
        return formatDuration(
          (d.quality ? 0 : 0)
        ) || "—";
      }
      case "diaper": {
        const dt = d.diaperType as string;
        return dt === "wet" ? "Islak" : dt === "dirty" ? "Kaka" : "Islak + Kaka";
      }
      case "ec": {
        return (d.success as boolean) ? "✅ Başarılı" : "❌ Kaçırma";
      }
      default: return "";
    }
  };

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

      {loading ? (
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
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4">
            <Plus size={28} />
          </div>
          <h2 className="font-serif text-lg text-on-surface mb-2">
            Bugün için henüz kayıt yok
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            İlk kaydınızı eklemek için aşağıdaki + butonuna dokunun.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
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
                    <h3 className="text-sm font-medium text-on-surface">
                      {getLogLabel(log.type)}
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      {formatTimeAgo(new Date(log.startedAt))}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {getLogSummary(log)}
                  </p>
                  {log.notes && (
                    <p className="text-xs text-on-surface-variant/70 mt-1 italic">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </div>

                <span className="text-xs text-on-surface-variant/50 shrink-0">
                  {new Date(log.startedAt).toLocaleTimeString("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <FAB onSelect={handleOpenLog} open={showFabMenu} onToggle={() => setShowFabMenu(!showFabMenu)} />

      {showLogForm && childId && (
        <LogForm
          type={logType}
          childId={childId}
          onClose={() => setShowLogForm(false)}
          onSaved={handleSaved}
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
