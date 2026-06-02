"use client";

import { useState, useEffect } from "react";
import {
  UtensilsCrossed,
  Moon,
  Baby,
  Droplets,
  X,
} from "lucide-react";
import { Timer } from "./timer";
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
}

interface LogFormProps {
  type: "feeding" | "sleep" | "diaper" | "ec";
  childId: string;
  onClose: () => void;
  onSaved: () => void;
  existingLog?: DailyLog;
}

export function LogForm({ type, childId, onClose, onSaved, existingLog }: LogFormProps) {
  const isEdit = !!existingLog;
  const [notes, setNotes] = useState(existingLog?.notes || "");
  const [saving, setSaving] = useState(false);
  const [logDate, setLogDate] = useState(
    existingLog?.logDate ? new Date(existingLog.logDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  );

  // Feeding state
  const [feedType, setFeedType] = useState<"breast" | "formula" | "solids">("breast");
  const [feedAmount, setFeedAmount] = useState("");
  const [leftDuration, setLeftDuration] = useState(0);
  const [rightDuration, setRightDuration] = useState(0);
  const [breastSide, setBreastSide] = useState<"left" | "right">("left");
  const [breastMinutes, setBreastMinutes] = useState("");
  const [breastSeconds, setBreastSeconds] = useState("");

  // Sleep state
  const [sleepDuration, setSleepDuration] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [fallAsleep, setFallAsleep] = useState("");
  const [sleepLocation, setSleepLocation] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [sleepMins, setSleepMins] = useState("");

  // Diaper state
  const [diaperType, setDiaperType] = useState<"wet" | "dirty" | "both">("wet");
  const [diaperColor, setDiaperColor] = useState("");
  const [diaperConsistency, setDiaperConsistency] = useState("");
  const [diaperTime, setDiaperTime] = useState(new Date().toTimeString().slice(0, 5));

  // EC state
  const [ecSuccess, setEcSuccess] = useState(true);
  const [ecCue, setEcCue] = useState("");
  const [ecPosition, setEcPosition] = useState("");

  const config = {
    feeding: { title: "Beslenme Kaydı", icon: UtensilsCrossed, color: "bg-feeding text-feeding-text" },
    sleep: { title: "Uyku Kaydı", icon: Moon, color: "bg-sleep text-sleep-text" },
    diaper: { title: "Alt Değiştirme", icon: Baby, color: "bg-diaper text-diaper-text" },
    ec: { title: "Tuvalet İletişimi", icon: Droplets, color: "bg-ec text-ec-text" },
  };

  const c = config[type];
  const Icon = c.icon;

  useEffect(() => {
    if (!existingLog) return;
    const d = existingLog.data;
    if (d) {
      if (type === "feeding") {
        const ft = (d.feedType as string) || "breast";
        setFeedType(ft as "breast" | "formula" | "solids");
        if (ft === "formula" || ft === "solids") {
          setFeedAmount(String(d.amount ?? ""));
        } else {
          setLeftDuration((d.leftDuration as number) || 0);
          setRightDuration((d.rightDuration as number) || 0);
        }
      } else if (type === "sleep") {
        const dur = existingLog.startedAt && existingLog.endedAt
          ? new Date(existingLog.endedAt).getTime() - new Date(existingLog.startedAt).getTime()
          : 0;
        setSleepDuration(dur);
        setSleepQuality((d.quality as number) || 3);
        setFallAsleep((d.fallAsleep as string) || "");
        setSleepLocation((d.location as string) || "");
      } else if (type === "diaper") {
        setDiaperType((d.diaperType as "wet" | "dirty" | "both") || "wet");
        setDiaperColor((d.color as string) || "");
        setDiaperConsistency((d.consistency as string) || "");
        if (existingLog.startedAt) {
          const t = new Date(existingLog.startedAt);
          setDiaperTime(`${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`);
        }
      } else if (type === "ec") {
        setEcSuccess((d.success as boolean) !== false);
        setEcCue((d.cue as string) || "");
        setEcPosition((d.position as string) || "");
      }
    }
    const dateStr = existingLog.logDate
      ? new Date(existingLog.logDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    setLogDate(dateStr);
  }, [existingLog, type]);

  const applyManualBreastTime = () => {
    const mins = parseInt(breastMinutes) || 0;
    const secs = parseInt(breastSeconds) || 0;
    const ms = (mins * 60 + secs) * 1000;
    if (ms === 0) return;
    if (breastSide === "left") setLeftDuration(leftDuration + ms);
    else setRightDuration(rightDuration + ms);
    setBreastMinutes("");
    setBreastSeconds("");
  };

  const applyManualSleepTime = () => {
    const hrs = parseInt(sleepHours) || 0;
    const mins = parseInt(sleepMins) || 0;
    const ms = (hrs * 60 + mins) * 60 * 1000;
    if (ms === 0) return;
    setSleepDuration(sleepDuration + ms);
    setSleepHours("");
    setSleepMins("");
  };

  const handleSave = async () => {
    setSaving(true);

    let logData: Record<string, unknown> = {};
    let startedAt: string | undefined;
    let endedAt: string | undefined;

    if (type === "feeding") {
      logData = {
        feedType,
        amount: feedAmount ? Number(feedAmount) : null,
        leftDuration,
        rightDuration,
      };
    } else if (type === "sleep") {
      const now = new Date(`${logDate}T${new Date().toTimeString().slice(0, 8)}`);
      endedAt = now.toISOString();
      startedAt = new Date(now.getTime() - sleepDuration).toISOString();
      logData = {
        quality: sleepQuality,
        fallAsleep: fallAsleep || null,
        location: sleepLocation || null,
      };
    } else if (type === "diaper") {
      const occurrenceTime = new Date(`${logDate}T${diaperTime}:00`).toISOString();
      startedAt = occurrenceTime;
      logData = {
        diaperType,
        color: diaperColor || null,
        consistency: diaperConsistency || null,
      };
    } else if (type === "ec") {
      logData = {
        success: ecSuccess,
        cue: ecCue || null,
        position: ecPosition || null,
      };
    }

    try {
      const isUpdate = !!existingLog;
      const method = isUpdate ? "PUT" : "POST";
      const payload: Record<string, unknown> = {
        childId,
        type,
        logDate: new Date(`${logDate}T12:00:00`).toISOString(),
        startedAt: startedAt || existingLog?.startedAt || new Date(`${logDate}T${new Date().toTimeString().slice(0, 8)}`).toISOString(),
        endedAt: endedAt !== undefined ? endedAt : existingLog?.endedAt ?? null,
        data: logData,
        notes: notes || null,
      };
      if (isUpdate) {
        payload.id = existingLog!.id;
      }

      const res = await fetch("/api/daily-logs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isUpdate ? "Güncellendi" : "Kaydedildi");
        onSaved();
        onClose();
      } else {
        toast.error(isUpdate ? "Güncelleme başarısız" : "Kayıt başarısız");
      }
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-surface w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-surface rounded-t-2xl border-b border-outline-variant/10 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-full ${c.color} flex items-center justify-center`}>
              <Icon size={18} />
            </div>
            <h2 className="font-serif text-lg text-on-surface">{c.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Tarih</label>
            <input
              type="date"
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {type === "feeding" && (
            <>
              <div className="flex gap-2">
                {(["breast", "formula", "solids"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFeedType(t)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      feedType === t
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {t === "breast" ? "Anne Sütü" : t === "formula" ? "Formül" : "Ek Gıda"}
                  </button>
                ))}
              </div>

              {feedType === "breast" && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setBreastSide("left")}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        breastSide === "left"
                          ? "bg-feeding text-feeding-text border-2 border-feeding-text/30"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      Sol Meme
                    </button>
                    <button
                      type="button"
                      onClick={() => setBreastSide("right")}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        breastSide === "right"
                          ? "bg-feeding text-feeding-text border-2 border-feeding-text/30"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      Sağ Meme
                    </button>
                  </div>
                  <Timer
                    label={breastSide === "left" ? "Sol" : "Sağ"}
                    onStop={(ms) => {
                      if (breastSide === "left") setLeftDuration(leftDuration + ms);
                      else setRightDuration(rightDuration + ms);
                    }}
                  />
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>veya süre gir:</span>
                    <input
                      type="number"
                      value={breastMinutes}
                      onChange={(e) => setBreastMinutes(e.target.value)}
                      placeholder="dk"
                      className="w-14 px-2 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                      min="0"
                    />
                    <span>dk</span>
                    <input
                      type="number"
                      value={breastSeconds}
                      onChange={(e) => setBreastSeconds(e.target.value)}
                      placeholder="sn"
                      className="w-14 px-2 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                      min="0"
                      max="59"
                    />
                    <span>sn</span>
                    <button
                      type="button"
                      onClick={applyManualBreastTime}
                      className="px-2.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container text-xs font-medium"
                    >
                      Ekle
                    </button>
                  </div>
                  {(leftDuration > 0 || rightDuration > 0) && (
                    <p className="text-xs text-on-surface-variant">
                      Sol: {Math.floor(leftDuration / 60000)} dk • Sağ: {Math.floor(rightDuration / 60000)} dk
                    </p>
                  )}
                </div>
              )}

              {(feedType === "formula" || feedType === "solids") && (
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">
                    {feedType === "formula" ? "Miktar (ml)" : "Miktar / İçerik"}
                  </label>
                  <input
                    type="text"
                    value={feedAmount}
                    onChange={(e) => setFeedAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder={feedType === "formula" ? "150" : "1 kase yoğurt, yarım muz..."}
                  />
                </div>
              )}
            </>
          )}

          {type === "sleep" && (
            <div className="space-y-4">
              <Timer label="Uyku süresi" onStop={(ms) => setSleepDuration(sleepDuration + ms)} />
              <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                <span>veya süre gir:</span>
                <input
                  type="number"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="sa"
                  className="w-14 px-2 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                  min="0"
                />
                <span>sa</span>
                <input
                  type="number"
                  value={sleepMins}
                  onChange={(e) => setSleepMins(e.target.value)}
                  placeholder="dk"
                  className="w-14 px-2 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm"
                  min="0"
                  max="59"
                />
                <span>dk</span>
                <button
                  type="button"
                  onClick={applyManualSleepTime}
                  className="px-2.5 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container text-xs font-medium"
                >
                  Ekle
                </button>
              </div>
              {sleepDuration > 0 && (
                <p className="text-sm text-on-surface-variant">
                  Toplam: {Math.floor(sleepDuration / 60000)} dakika
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">
                  Uyku Kalitesi
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setSleepQuality(n)}
                      className={`w-10 h-10 rounded-full text-lg transition-colors ${
                        sleepQuality === n
                          ? "bg-sleep text-sleep-text scale-110"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {n === 1 ? "😫" : n === 2 ? "😕" : n === 3 ? "😐" : n === 4 ? "😊" : "😴"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Uykuya Dalma</label>
                  <select
                    value={fallAsleep}
                    onChange={(e) => setFallAsleep(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Seçin</option>
                    <option value="self">Kendi kendine</option>
                    <option value="breastfeeding">Emzirerek</option>
                    <option value="rocking">Sallanarak</option>
                    <option value="stroller">Bebek arabasında</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Uyku Yeri</label>
                  <select
                    value={sleepLocation}
                    onChange={(e) => setSleepLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Seçin</option>
                    <option value="crib">Beşik</option>
                    <option value="parents_bed">Ebeveyn yatağı</option>
                    <option value="stroller">Bebek arabası</option>
                    <option value="car_seat">Araba koltuğu</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === "diaper" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Saat Kaçta</label>
                <input
                  type="time"
                  value={diaperTime}
                  onChange={(e) => setDiaperTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-2">
                {(["wet", "dirty", "both"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDiaperType(t)}
                    className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                      diaperType === t
                        ? "bg-diaper text-diaper-text"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {t === "wet" ? "Islak" : t === "dirty" ? "Kaka" : "İkisi"}
                  </button>
                ))}
              </div>

              {(diaperType === "dirty" || diaperType === "both") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Renk</label>
                    <select
                      value={diaperColor}
                      onChange={(e) => setDiaperColor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Seçin</option>
                      <option value="yellow">Sarı</option>
                      <option value="green">Yeşil</option>
                      <option value="brown">Kahverengi</option>
                      <option value="dark_green">Koyu Yeşil</option>
                      <option value="mustard">Hardal</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-1.5">Kıvam</label>
                    <select
                      value={diaperConsistency}
                      onChange={(e) => setDiaperConsistency(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Seçin</option>
                      <option value="liquid">Sıvı</option>
                      <option value="soft">Yumuşak</option>
                      <option value="formed">Şekilli</option>
                      <option value="hard">Sert</option>
                      <option value="seedy">Tanecikli</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === "ec" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEcSuccess(true)}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors ${
                    ecSuccess
                      ? "bg-ec text-ec-text"
                      : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  ✅ Başarılı
                </button>
                <button
                  type="button"
                  onClick={() => setEcSuccess(false)}
                  className={`flex-1 py-3 rounded-full text-sm font-medium transition-colors ${
                    !ecSuccess
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-surface-container-low text-on-surface-variant"
                  }`}
                >
                  ❌ Kaçırma
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">İşaret Sesi</label>
                  <input
                    type="text"
                    value={ecCue}
                    onChange={(e) => setEcCue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                    placeholder="çişşş, psss..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Pozisyon</label>
                  <select
                    value={ecPosition}
                    onChange={(e) => setEcPosition(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">Seçin</option>
                    <option value="sink">Lavabo</option>
                    <option value="toilet">Klozet</option>
                    <option value="adapter">Tuvalet adaptörü</option>
                    <option value="potty">Lazımlık</option>
                    <option value="outside">Dışarıda</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Not
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              placeholder="İsteğe bağlı not..."
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-medium text-sm hover:bg-surface-tint transition-colors disabled:opacity-50"
          >
            {saving ? (isEdit ? "Güncelleniyor..." : "Kaydediliyor...") : (isEdit ? "Güncelle" : "Kaydet")}
          </button>
        </div>
      </div>
    </div>
  );
}
