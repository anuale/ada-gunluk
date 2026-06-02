"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp, Ruler, Syringe, Smile, Stethoscope,
  Check, Plus, X, Circle, UserPlus, Eye, Pencil, Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import toast from "react-hot-toast";

type Tab = "milestones" | "growth" | "vaccines" | "teeth" | "doctor" | "observations";

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface Milestone {
  id: string;
  category: string;
  title: string;
  description: string;
  ageMonth: number;
  achievedAt: string | null;
}

interface Measurement {
  id: string;
  date: string;
  weightKg: number | null;
  heightCm: number | null;
  headCircumferenceCm: number | null;
}

interface Vaccination {
  id: string;
  vaccineName: string;
  doseNumber: number;
  scheduledDate: string;
  administeredAt: string | null;
}

interface DoctorVisit {
  id: string;
  date: string;
  doctorName: string | null;
  reason: string | null;
  weightKg: number | null;
  heightCm: number | null;
  notes: string | null;
}

interface DailyLog {
  id: string;
  type: string;
  startedAt: string;
  logDate: string;
  notes: string | null;
  data: Record<string, unknown> | null;
}

const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "milestones", label: "Kilometre Taşları", icon: TrendingUp },
  { key: "growth", label: "Büyüme", icon: Ruler },
  { key: "vaccines", label: "Aşılar", icon: Syringe },
  { key: "teeth", label: "Diş", icon: Smile },
  { key: "doctor", label: "Doktor", icon: Stethoscope },
  { key: "observations", label: "Gözlem", icon: Eye },
];

const categories: { key: string; label: string }[] = [
  { key: "motor", label: "Motor" },
  { key: "language", label: "Dil" },
  { key: "cognitive", label: "Bilişsel" },
  { key: "social", label: "Sosyal" },
];

export default function DevelopmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("milestones");
  const [child, setChild] = useState<Child | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [visits, setVisits] = useState<DoctorVisit[]>([]);
  const [observations, setObservations] = useState<DailyLog[]>([]);
  const [obsNote, setObsNote] = useState("");
  const [obsDate, setObsDate] = useState(new Date().toISOString().split("T")[0]);
  const [milestoneFilter, setMilestoneFilter] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  // Growth form
  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [growthDate, setGrowthDate] = useState(new Date().toISOString().split("T")[0]);
  const [growthWeight, setGrowthWeight] = useState("");
  const [growthHeight, setGrowthHeight] = useState("");
  const [growthHead, setGrowthHead] = useState("");
  const [editingGrowthId, setEditingGrowthId] = useState<string | null>(null);

  // Doctor form
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorDate, setDoctorDate] = useState(new Date().toISOString().split("T")[0]);
  const [doctorName, setDoctorName] = useState("");
  const [doctorReason, setDoctorReason] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  // Vaccine state
  const [newVaccineName, setNewVaccineName] = useState("");
  const [newVaccineDate, setNewVaccineDate] = useState(new Date().toISOString().split("T")[0]);
  const [showVaccineForm, setShowVaccineForm] = useState(false);

  const fetchChild = useCallback(async () => {
    const r = await fetch("/api/children");
    const d = await r.json();
    if (d.children?.length > 0) {
      const c: Child = d.children[0];
      setChild(c);
      return c;
    }
    return null;
  }, []);

  const fetchData = useCallback(async (c: Child) => {
    const [mRes, gRes, vRes, dRes, oRes] = await Promise.all([
      fetch(`/api/milestones?childId=${c.id}`),
      fetch(`/api/growth?childId=${c.id}`),
      fetch(`/api/vaccinations?childId=${c.id}`),
      fetch(`/api/doctor-visits?childId=${c.id}`),
      fetch(`/api/daily-logs?childId=${c.id}&type=development`),
    ]);
    setMilestones(await mRes.json());
    setMeasurements(await gRes.json());
    setVaccinations(await vRes.json());
    setVisits(await dRes.json());
    setObservations(await oRes.json());
  }, []);

  useEffect(() => {
    fetchChild().then((c) => { if (c) fetchData(c); });
  }, [fetchChild, fetchData]);

  const handleSeed = async () => {
    if (!child) return;
    setSeeding(true);
    try {
      const res = await fetch(`/api/children/${child.id}/seed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: child.id, birthDate: child.birthDate }),
      });
      if (res.ok) {
        toast.success("Gelişim verileri oluşturuldu");
        fetchData(child);
      }
    } catch { toast.error("Hata"); }
    finally { setSeeding(false); }
  };

  const toggleMilestone = async (m: Milestone) => {
    const res = await fetch("/api/milestones", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: m.id,
        achievedAt: m.achievedAt ? null : new Date().toISOString(),
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMilestones((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    }
  };

  const saveGrowth = async () => {
    if (!child) return;
    const res = await fetch("/api/growth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: child.id,
        date: growthDate,
        weightKg: growthWeight ? Number(growthWeight) : null,
        heightCm: growthHeight ? Number(growthHeight) : null,
        headCircumferenceCm: growthHead ? Number(growthHead) : null,
      }),
    });
    if (res.ok) {
      toast.success("Ölçüm kaydedildi");
      setShowGrowthForm(false);
      setEditingGrowthId(null);
      fetchData(child);
    }
  };

  const deleteGrowth = async (id: string) => {
    if (!child || !confirm("Bu ölçümü silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/growth?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Ölçüm silindi"); fetchData(child); }
  };

  const editGrowth = (m: Measurement) => {
    setGrowthDate(new Date(m.date).toISOString().split("T")[0]);
    setGrowthWeight(m.weightKg ? String(m.weightKg) : "");
    setGrowthHeight(m.heightCm ? String(m.heightCm) : "");
    setGrowthHead(m.headCircumferenceCm ? String(m.headCircumferenceCm) : "");
    setEditingGrowthId(m.id);
    setShowGrowthForm(true);
  };

  const markVaccine = async (id: string) => {
    const res = await fetch("/api/vaccinations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setVaccinations((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.success("Aşı durumu güncellendi");
    }
  };

  const updateVaccineDate = async (id: string, dateStr: string) => {
    if (!child) return;
    await fetch("/api/vaccinations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, administeredAt: dateStr ? new Date(dateStr).toISOString() : null }) });
    fetchData(child);
    toast.success("Aşı tarihi güncellendi");
  };

  const deleteVaccine = async (id: string) => {
    if (!child || !confirm("Bu aşıyı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/vaccinations?id=${id}`, { method: "DELETE" });
    fetchData(child);
    toast.success("Aşı silindi");
  };

  const addCustomVaccine = async () => {
    if (!child || !newVaccineName.trim()) return;
    const res = await fetch("/api/vaccinations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ childId: child.id, vaccineName: newVaccineName, scheduledDate: newVaccineDate ? new Date(newVaccineDate) : null }) });
    if (res.ok) { toast.success("Aşı eklendi"); setNewVaccineName(""); setShowVaccineForm(false); fetchData(child); }
  };

  const saveDoctorVisit = async () => {
    if (!child) return;
    const res = await fetch("/api/doctor-visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId: child.id,
        date: doctorDate,
        doctorName: doctorName || null,
        reason: doctorReason || null,
        notes: doctorNotes || null,
      }),
    });
    if (res.ok) {
      toast.success("Doktor ziyareti kaydedildi");
      setShowDoctorForm(false);
      fetchData(child);
    }
  };

  const saveObservation = async () => {
    if (!child || !obsNote.trim()) return;
    const res = await fetch("/api/daily-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: child.id, type: "development", logDate: `${obsDate}T12:00:00.000Z`, notes: obsNote, startedAt: `${obsDate}T12:00:00.000Z` }),
    });
    if (res.ok) { toast.success("Gözlem kaydedildi"); setObsNote(""); fetchData(child); }
  };

  const deleteObservation = async (id: string) => {
    if (!child || !confirm("Bu gözlemi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/daily-logs?id=${id}`, { method: "DELETE" });
    fetchData(child);
    toast.success("Gözlem silindi");
  };

  const editObservation = async (obs: DailyLog) => {
    const newNote = prompt("Gözlemi düzenle:", obs.notes || "");
    if (!newNote || !child) return;
    const res = await fetch("/api/daily-logs", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: obs.id, notes: newNote }) });
    if (res.ok) { toast.success("Gözlem güncellendi"); fetchData(child); }
  };

  const fmtAgeMonth = (m: number) => {
    const months = Math.floor(m);
    if (m < 1) {
      const week = Math.round(m * 4);
      return `${months + 1}. Ay / ${week}. Hafta`;
    }
    const fractionalWeeks = Math.round((m - months) * 4);
    if (fractionalWeeks > 0) return `${months}. Ay / ${fractionalWeeks}. Hafta`;
    if (months % 12 === 0 && months > 0) return `${months / 12} Yaş`;
    return `${months}. Ay`;
  };

  if (!child) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-2xl text-primary">Gelişim</h1>
        <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
          <UserPlus size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
          <p className="text-on-surface-variant mb-4">Gelişim takibi için önce bir çocuk profili ekleyin.</p>
          <Link
            href="/children/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
          >
            <Plus size={16} />
            Çocuk Ekle
          </Link>
        </div>
      </div>
    );
  }

  const ageMonths = Math.floor(
    (new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );

  const filteredMilestones = milestoneFilter
    ? milestones.filter((m) => m.category === milestoneFilter)
    : milestones;

  const achieved = milestones.filter((m) => m.achievedAt).length;
  const progressPct = milestones.length > 0 ? Math.round((achieved / milestones.length) * 100) : 0;

  const growthData = measurements.map((m) => ({
    date: new Date(m.date).toLocaleDateString("tr-TR", { month: "short", year: "2-digit" }),
    weight: m.weightKg,
    height: m.heightCm,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary">Gelişim</h1>
        {milestones.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
          >
            {seeding ? "..." : "Gelişim Verilerini Yükle"}
          </button>
        )}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-surface-container-low rounded-2xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? "bg-surface text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* MILESTONES TAB */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          {/* Progress overview */}
          {milestones.length > 0 && (
            <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-on-surface">Genel İlerleme</h3>
                <span className="text-sm font-medium text-primary">{progressPct}%</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-2">
                {achieved} / {milestones.length} kilometre taşı tamamlandı
              </p>
            </div>
          )}

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setMilestoneFilter(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                !milestoneFilter ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              Tümü
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setMilestoneFilter(c.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  milestoneFilter === c.key ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Milestone list */}
          {milestones.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
              <Circle size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">
                &ldquo;Gelişim Verilerini Yükle&rdquo; butonuna tıklayarak kilometre taşlarını oluşturabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredMilestones.map((m) => {
                const isAchieved = !!m.achievedAt;
                const isForAge = m.ageMonth <= ageMonths + 2;
                return (
                  <button
                    key={m.id}
                    onClick={() => toggleMilestone(m)}
                    disabled={!isForAge && !isAchieved}
                    className={`w-full text-left bg-surface rounded-2xl p-4 shadow-sm border transition-all flex items-start gap-3 ${
                      isAchieved
                        ? "border-primary/30 bg-primary-container/20"
                        : "border-outline-variant/10 hover:border-primary/20"
                    } ${!isForAge && !isAchieved ? "opacity-30" : ""}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isAchieved
                          ? "bg-primary border-primary text-on-primary"
                          : "border-outline-variant text-transparent"
                      }`}
                    >
                      <Check size={14} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-on-surface">{m.title}</h4>
                        <span className="text-[10px] text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded-full">
                          {fmtAgeMonth(m.ageMonth)}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{m.description}</p>
                      {isAchieved && (
                        <p className="text-xs text-primary mt-1">
                          ✓ {new Date(m.achievedAt!).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* GROWTH TAB */}
      {activeTab === "growth" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowGrowthForm(true)}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint"
            >
              <Plus size={16} /> Ölçüm Ekle
            </button>
          </div>

          {/* Growth Form Modal */}
          {showGrowthForm && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-surface w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-xl p-4 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-on-surface">Ölçüm Ekle</h3>
                  <button onClick={() => setShowGrowthForm(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
                    <X size={18} />
                  </button>
                </div>
                <input type="date" value={growthDate} onChange={(e) => setGrowthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">Kilo (kg)</label>
                    <input type="number" step="0.01" value={growthWeight} onChange={(e) => setGrowthWeight(e.target.value)}
                      placeholder="8.5" className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-on-surface-variant mb-1">Boy (cm)</label>
                    <input type="number" step="0.1" value={growthHeight} onChange={(e) => setGrowthHeight(e.target.value)}
                      placeholder="72.5" className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-on-surface-variant mb-1">Baş Çevresi (cm)</label>
                  <input type="number" step="0.1" value={growthHead} onChange={(e) => setGrowthHead(e.target.value)}
                    placeholder="44.5" className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                </div>
                <button onClick={saveGrowth} className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-medium">
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {measurements.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
              <Ruler size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">Henüz büyüme ölçümü yok.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Weight chart */}
              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10">
                <h3 className="font-serif text-lg text-on-surface mb-1">Kilo (kg)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e2" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#73796f" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#73796f" />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#436440" strokeWidth={2} dot={{ fill: "#436440", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Height chart */}
              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10">
                <h3 className="font-serif text-lg text-on-surface mb-1">Boy (cm)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e2" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#73796f" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#73796f" />
                    <Tooltip />
                    <Line type="monotone" dataKey="height" stroke="#7b5455" strokeWidth={2} dot={{ fill: "#7b5455", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10">
                <h3 className="font-serif text-lg text-on-surface mb-3">Tüm Ölçümler</h3>
                <div className="space-y-3">
                  {Object.entries(
                    measurements.reduce((acc, m) => {
                      const d = new Date(m.date).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                      if (!acc[d]) acc[d] = []; acc[d].push(m); return acc;
                    }, {} as Record<string, Measurement[]>)
                  ).map(([date, items]) => (
                    <div key={date}>
                      <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1 mb-1">{date}</h4>
                      <div className="space-y-1">
                        {items.map((m) => (
                          <div key={m.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                            <div className="flex gap-3 text-sm">
                              {m.weightKg && <span className="text-on-surface">{m.weightKg} kg</span>}
                              {m.heightCm && <span className="text-on-surface">{m.heightCm} cm</span>}
                              {m.headCircumferenceCm && <span className="text-on-surface-variant">{m.headCircumferenceCm} cm (baş)</span>}
                            </div>
                            <div className="flex gap-0.5">
                              <button onClick={() => editGrowth(m)} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-primary"><Pencil size={12} /></button>
                              <button onClick={() => deleteGrowth(m.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-error"><Trash2 size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VACCINES TAB */}
      {activeTab === "vaccines" && (
        <div className="space-y-3">
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10">
            <h3 className="font-serif text-lg text-on-surface mb-1">T.C. Sağlık Bakanlığı Aşı Takvimi</h3>
            <p className="text-xs text-on-surface-variant">Ücretsiz, Aile Sağlığı Merkezlerinde uygulanır</p>
          </div>

          <button onClick={() => setShowVaccineForm(!showVaccineForm)} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint">
            <Plus size={16} /> Aşı Ekle
          </button>

          {showVaccineForm && (
            <div className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/10 space-y-3">
              <input type="text" value={newVaccineName} onChange={(e) => setNewVaccineName(e.target.value)}
                placeholder="Aşı adı" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
              <input type="date" value={newVaccineDate} onChange={(e) => setNewVaccineDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
              <button onClick={addCustomVaccine} className="w-full py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium">Ekle</button>
            </div>
          )}

          {vaccinations.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
              <Syringe size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">Henüz aşı kaydı yok.</p>
            </div>
          ) : (
            vaccinations.map((v) => {
              const isDone = !!v.administeredAt;
              const scheduledDate = new Date(v.scheduledDate);
              const isOverdue = !isDone && scheduledDate < new Date();
              return (
                <div key={v.id} className={`bg-surface rounded-2xl p-4 shadow-sm border transition-all flex items-center gap-3 ${isDone ? "border-primary/30 bg-primary-container/10" : isOverdue ? "border-error/30" : "border-outline-variant/10"}`}>
                  <button onClick={() => markVaccine(v.id)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${isDone ? "bg-primary border-primary text-on-primary" : "border-outline-variant"} cursor-pointer hover:border-primary`}>
                    {isDone && <Check size={14} />}
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">{v.vaccineName} {v.doseNumber > 1 ? `(${v.doseNumber}. Doz)` : ""}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="date"
                        value={v.administeredAt ? new Date(v.administeredAt).toISOString().split("T")[0] : ""}
                        onChange={(e) => updateVaccineDate(v.id, e.target.value)}
                        className="text-xs px-2 py-1 rounded-lg border border-outline-variant bg-surface-container-lowest" />
                      {!v.administeredAt && <span className="text-xs text-on-surface-variant">Plan: {scheduledDate.toLocaleDateString("tr-TR")}{isOverdue ? " ⚠️" : ""}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteVaccine(v.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/30 hover:text-error hover:bg-error-container/10"><Trash2 size={13} /></button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TEETH TAB */}
      {activeTab === "teeth" && (
        <div className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
          <h3 className="font-serif text-lg text-on-surface mb-4">Diş Takibi</h3>
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
            <TeethJaw label="Üst Çene" positions={["right_back", "right_front", "front_right", "front_left", "left_front", "left_back"]} />
            <TeethJaw label="Alt Çene" positions={["right_back", "right_front", "front_right", "front_left", "left_front", "left_back"]} />
          </div>
          <div className="mt-6 p-4 bg-surface-container-low rounded-xl">
            <h4 className="text-sm font-medium text-on-surface mb-2">Diş Çıkarma Sıralaması</h4>
            <div className="space-y-1 text-xs text-on-surface-variant">
              <p><span className="font-medium text-on-surface">6-10 ay:</span> Alt ön kesiciler</p>
              <p><span className="font-medium text-on-surface">8-12 ay:</span> Üst ön kesiciler</p>
              <p><span className="font-medium text-on-surface">9-13 ay:</span> Üst yan kesiciler</p>
              <p><span className="font-medium text-on-surface">10-16 ay:</span> Alt yan kesiciler</p>
              <p><span className="font-medium text-on-surface">13-19 ay:</span> İlk azı dişleri</p>
              <p><span className="font-medium text-on-surface">16-22 ay:</span> Köpek dişleri</p>
              <p><span className="font-medium text-on-surface">23-33 ay:</span> İkinci azı dişleri</p>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR VISITS TAB */}
      {activeTab === "doctor" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowDoctorForm(true)}
              className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint"
            >
              <Plus size={16} /> Ziyaret Ekle
            </button>
          </div>

          {showDoctorForm && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-surface w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-xl p-4 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-on-surface">Doktor Ziyareti</h3>
                  <button onClick={() => setShowDoctorForm(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
                    <X size={18} />
                  </button>
                </div>
                <input type="date" value={doctorDate} onChange={(e) => setDoctorDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Doktor adı" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                <input type="text" value={doctorReason} onChange={(e) => setDoctorReason(e.target.value)}
                  placeholder="Ziyaret sebebi" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
                <textarea value={doctorNotes} onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={3} placeholder="Notlar" className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm resize-none" />
                <button onClick={saveDoctorVisit} className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-medium">
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {visits.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
              <Stethoscope size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">Henüz doktor ziyareti kaydı yok.</p>
            </div>
          ) : (
            visits.map((v) => (
              <div key={v.id} className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-on-surface">{v.doctorName || "Doktor Ziyareti"}</p>
                  <span className="text-xs text-on-surface-variant">{new Date(v.date).toLocaleDateString("tr-TR")}</span>
                </div>
                {v.reason && <p className="text-xs text-on-surface-variant">{v.reason}</p>}
                <div className="flex gap-4 mt-2">
                  {v.weightKg && <span className="text-xs bg-surface-container-low px-2 py-0.5 rounded-full">{v.weightKg} kg</span>}
                  {v.heightCm && <span className="text-xs bg-surface-container-low px-2 py-0.5 rounded-full">{v.heightCm} cm</span>}
                </div>
                {v.notes && <p className="text-xs text-on-surface-variant mt-2 italic">{v.notes}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* OBSERVATIONS TAB */}
      {activeTab === "observations" && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10 space-y-3">
            <h3 className="font-serif text-lg text-on-surface">Gelişim Gözlemi Ekle</h3>
            <input type="date" value={obsDate} onChange={(e) => setObsDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
            <textarea value={obsNote} onChange={(e) => setObsNote(e.target.value)} rows={3}
              placeholder="Bugün neler gözlemledin? Yeni bir beceri, ilginç bir davranış..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm resize-none" />
            <button onClick={saveObservation} disabled={!obsNote.trim()}
              className="w-full py-3 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-surface-tint disabled:opacity-50">
              Gözlem Ekle
            </button>
          </div>

          {observations.length === 0 ? (
            <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
              <Eye size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
              <p className="text-on-surface-variant text-sm">Henüz gelişim gözlemi yok.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(
                observations.reduce((acc, o) => {
                  const d = new Date(o.startedAt).toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                  if (!acc[d]) acc[d] = []; acc[d].push(o); return acc;
                }, {} as Record<string, DailyLog[]>)
              ).map(([date, items]) => (
                <div key={date}>
                  <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1 mb-2">{date}</h3>
                  <div className="space-y-2">
                    {items.map((o) => (
                      <div key={o.id} className="bg-surface rounded-2xl p-4 shadow-sm border border-outline-variant/10">
                        <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{o.notes || "—"}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-on-surface-variant/50">{new Date(o.startedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</span>
                          <div className="flex gap-1">
                            <button onClick={() => editObservation(o)} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-primary"><Pencil size={12} /></button>
                            <button onClick={() => deleteObservation(o.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-error"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TeethJaw({ label, positions }: { label: string; positions: string[] }) {
  return (
    <div>
      <p className="text-xs font-medium text-on-surface-variant text-center mb-2">{label}</p>
      <div className="flex justify-center gap-0.5">
        {positions.map((pos, i) => (
          <div
            key={pos}
            className="flex flex-col items-center"
          >
            <div className={`w-5 h-6 rounded-sm border border-outline-variant/40 bg-surface-container-lowest ${[0, 5].includes(i) ? "w-6" : ""}`} />
            <div className="w-2 h-3 bg-surface-container-highest rounded-b-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
