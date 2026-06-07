"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  childId: string;
  onClose: () => void;
  onSaved: () => void;
}

const moods = [
  { value: 1, emoji: "😫", label: "Zor" },
  { value: 2, emoji: "😕", label: "Biraz zor" },
  { value: 3, emoji: "😐", label: "Normal" },
  { value: 4, emoji: "😊", label: "İyi" },
  { value: 5, emoji: "🥰", label: "Harika" },
];

export function EndOfDayReflection({ childId, onClose, onSaved }: Props) {
  const [mood, setMood] = useState(3);
  const [journal, setJournal] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          date: new Date().toISOString().split("T")[0],
          mood,
          journal,
        }),
      });

      if (res.ok) {
        toast.success("Gün sonu kaydedildi ✨");
        onSaved();
        onClose();
      } else {
        toast.error("Kayıt başarısız");
      }
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm pb-[calc(env(safe-area-inset-bottom,1rem)+4.5rem)] md:pb-0">
      <div className="bg-surface w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-surface rounded-t-2xl border-b border-outline-variant/10 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h2 className="font-serif text-lg text-on-surface">Gün Sonu</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Bugün nasıldı?
            </label>
            <div className="flex justify-between gap-1">
              {moods.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    mood === m.value
                      ? "bg-primary-container scale-110"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className={`text-[10px] font-medium ${
                    mood === m.value ? "text-on-primary-container" : "text-on-surface-variant"
                  }`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">
              Günün özeti, düşüncelerin...
            </label>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none"
              placeholder="Bugün neler oldu? Ada neler yaptı? Sen neler hissettin?"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-medium text-sm hover:bg-surface-tint transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {saving ? "Kaydediliyor..." : "Günü Tamamla"}
          </button>
        </div>
      </div>
    </div>
  );
}
