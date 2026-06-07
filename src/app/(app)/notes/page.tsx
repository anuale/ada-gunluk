"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  X,
  Star,
  Pin,
  Pencil,
  Trash2,
  NotebookPen,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  linkedDate: string | null;
  isFavorite: boolean;
  updatedAt: string;
  user: { name: string };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterTag) params.set("tag", filterTag);
    if (showFavorites) params.set("favorites", "true");

    try {
      const res = await fetch(`/api/notes?${params}`);
      if (res.ok) setNotes(await res.json());
    } catch {
      toast.error("Notlar yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [search, filterTag, showFavorites]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNote = async () => {
    if (!editingNote?.title?.trim()) return;
    const isNew = !editingNote.id;

    try {
      const res = await fetch("/api/notes", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingNote),
      });

      if (res.ok) {
        toast.success(isNew ? "Not eklendi" : "Not güncellendi");
        setShowForm(false);
        setEditingNote(null);
        fetchNotes();
      }
    } catch {
      toast.error("Kayıt hatası");
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      toast.success("Not silindi");
      fetchNotes();
    } catch {
      toast.error("Silme hatası");
    }
  };

  const toggleFavorite = async (note: Note) => {
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: note.id, isFavorite: !note.isFavorite }),
    });
    fetchNotes();
  };

  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).slice(0, 15);

  const openNewNote = () => {
    setEditingNote({ title: "", content: "", tags: [], isFavorite: false });
    setShowForm(true);
  };

  const openEditNote = (note: Note) => {
    setEditingNote({ ...note });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary">Notlar</h1>
        <button
          onClick={openNewNote}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
        >
          <Plus size={16} /> Yeni Not
        </button>
      </div>

      {/* Search & filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Notlarda ara..."
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-on-surface-variant" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-colors ${
            showFavorites
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
          }`}
        >
          <Star size={14} className="inline mr-1" />
          Favoriler
        </button>
      </div>

      {/* Tag cloud */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? "" : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterTag === tag
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              #{tag}
            </button>
          ))}
          {filterTag && (
            <button onClick={() => setFilterTag("")} className="text-xs text-primary">
              Temizle
            </button>
          )}
        </div>
      )}

      {/* Note Form Modal */}
      {showForm && editingNote && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm pb-[calc(env(safe-area-inset-bottom,1rem)+4.5rem)] md:pb-0">
          <div className="bg-surface w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="sticky top-0 bg-surface rounded-t-2xl border-b border-outline-variant/10 p-4 flex items-center justify-between z-10">
              <h3 className="font-serif text-lg text-on-surface">
                {editingNote.id ? "Notu Düzenle" : "Yeni Not"}
              </h3>
              <button onClick={() => { setShowForm(false); setEditingNote(null); }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <input
                type="text"
                value={editingNote.title || ""}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="Not başlığı"
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm font-medium focus:outline-none focus:border-primary"
              />

              <textarea
                value={editingNote.content || ""}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                rows={8}
                placeholder="Notunuzu yazın..."
                className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary resize-none leading-relaxed"
              />

              <div>
                <label className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1.5">
                  <Tag size={12} /> Etiketler (virgülle ayırın)
                </label>
                <input
                  type="text"
                  value={(editingNote.tags || []).join(", ")}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      tags: e.target.value
                        .split(",")
                        .map((t) => t.trim().replace("#", ""))
                        .filter(Boolean),
                    })
                  }
                  placeholder="doktor, düşünce, anı..."
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-on-surface-variant mb-1.5">Tarihe Bağla (isteğe bağlı)</label>
                <input
                  type="date"
                  value={editingNote.linkedDate?.toString().split("T")[0] || ""}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, linkedDate: e.target.value || null })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingNote({ ...editingNote, isFavorite: !editingNote.isFavorite })}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                    editingNote.isFavorite
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-surface border-outline-variant text-on-surface-variant"
                  }`}
                >
                  <Star size={14} fill={editingNote.isFavorite ? "currentColor" : "none"} />
                  Favori
                </button>

                <button
                  onClick={saveNote}
                  className="flex-1 py-2.5 rounded-full bg-primary text-on-primary text-sm font-medium hover:bg-surface-tint"
                >
                  {editingNote.id ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-surface-container-highest rounded w-32 mb-2" />
              <div className="h-3 bg-surface-container-highest rounded w-56" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 text-center shadow-sm border border-outline-variant/10">
          <NotebookPen size={32} className="text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="font-serif text-lg text-on-surface mb-1">Henüz not yok</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            {search || filterTag
              ? "Aramanızla eşleşen not bulunamadı."
              : "İlk notunuzu oluşturmak için Yeni Not butonuna tıklayın."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-base text-on-surface pr-2">{note.title}</h3>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => toggleFavorite(note)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${note.isFavorite ? "text-amber-500" : "text-on-surface-variant/50 hover:text-amber-500"}`}
                  >
                    <Star size={14} fill={note.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => openEditNote(note)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/50 hover:text-primary"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/50 hover:text-error"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {note.content && (
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-3 whitespace-pre-wrap">
                  {note.content}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {note.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className="px-2 py-0.5 rounded-full bg-surface-container-low text-xs text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                  {note.linkedDate && <span>📅 {new Date(note.linkedDate).toLocaleDateString("tr-TR")}</span>}
                </div>
                <span className="text-[10px] text-on-surface-variant/40">
                  {new Date(note.updatedAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
