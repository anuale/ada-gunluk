"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

type ReportType = "daily" | "weekly" | "monthly" | "yearly";

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

const reportTypes: { key: ReportType; label: string; icon: typeof FileText }[] = [
  { key: "daily", label: "Günlük Rapor", icon: FileText },
  { key: "weekly", label: "Haftalık Rapor", icon: Calendar },
  { key: "monthly", label: "Aylık Rapor", icon: Calendar },
  { key: "yearly", label: "Yıllık Rapor", icon: Calendar },
];

export default function ReportsPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [reportType, setReportType] = useState<ReportType>("weekly");
  const [periodStart, setPeriodStart] = useState(getDefaultStart("weekly"));
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().split("T")[0]);
  const [reportContent, setReportContent] = useState("");
  const [reportFormat, setReportFormat] = useState<"text" | "pdf">("text");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/children")
      .then((r) => r.json())
      .then((d) => { if (d.children?.[0]) setChild(d.children[0]); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPeriodStart(getDefaultStart(reportType));
    setPeriodEnd(new Date().toISOString().split("T")[0]);
  }, [reportType]);

  const generateReport = async () => {
    if (!child) return;
    setGenerating(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId: child.id,
          reportType,
          periodStart,
          periodEnd,
          format: reportFormat,
        }),
      });
      const data = await res.json();
      if (data.report?.content) {
        setReportContent(data.report.content);
        setPreview(true);
        toast.success("Rapor oluşturuldu");
      }
    } catch {
      toast.error("Rapor oluşturulamadı");
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ada-gunluk-${reportType}-${periodStart}-${periodEnd}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rapor indirildi");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(reportContent);
    setCopied(true);
    toast.success("Kopyalandı");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-primary">Raporlar</h1>

      {!child ? (
        <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
          <p className="text-on-surface-variant text-sm">Rapor için önce bir çocuk profili ekleyin.</p>
        </div>
      ) : (
        <>
          {/* Report configuration */}
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-4">
            <h3 className="font-serif text-lg text-on-surface">Rapor Ayarları</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {reportTypes.map((rt) => (
                <button
                  key={rt.key}
                  onClick={() => setReportType(rt.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-sm font-medium transition-colors ${
                    reportType === rt.key
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <rt.icon size={18} />
                  {rt.label.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Başlangıç</label>
                <input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-on-surface-variant mb-1">Bitiş</label>
                <input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setReportFormat("text")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  reportFormat === "text"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Metin (.txt)
              </button>
              <button
                onClick={() => setReportFormat("pdf")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  reportFormat === "pdf"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                PDF
              </button>
            </div>

            <button
              onClick={generateReport}
              disabled={generating}
              className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-surface-tint transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Eye size={16} />
                  Raporu Oluştur
                </>
              )}
            </button>
          </div>

          {/* Preview modal */}
          {preview && reportContent && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-surface w-full max-w-2xl rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] flex flex-col animate-slide-up">
                <div className="sticky top-0 bg-surface rounded-t-2xl border-b border-outline-variant/10 p-4 flex items-center justify-between z-10">
                  <h3 className="font-serif text-lg text-on-surface">Rapor Önizleme</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    >
                      {copied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={downloadReport}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-primary hover:bg-primary-container/20 transition-colors"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => setPreview(false)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                  <pre className="text-sm text-on-surface whitespace-pre-wrap font-sans leading-relaxed">
                    {reportContent}
                  </pre>
                </div>

                <div className="p-4 border-t border-outline-variant/10 flex gap-3">
                  <button
                    onClick={downloadReport}
                    className="flex-1 py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-surface-tint flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> İndir ({reportFormat === "pdf" ? "PDF" : "TXT"})
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function getDefaultStart(type: ReportType): string {
  const now = new Date();
  switch (type) {
    case "daily": {
      const d = new Date(now); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0];
    }
    case "weekly": {
      const d = new Date(now); d.setDate(d.getDate() - 7); return d.toISOString().split("T")[0];
    }
    case "monthly": {
      const d = new Date(now); d.setMonth(d.getMonth() - 1); return d.toISOString().split("T")[0];
    }
    case "yearly": {
      const d = new Date(now); d.setFullYear(d.getFullYear() - 1); return d.toISOString().split("T")[0];
    }
  }
}
