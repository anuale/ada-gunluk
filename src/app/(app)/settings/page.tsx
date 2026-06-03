"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Pencil, Check, X, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface FamUser {
  id: string;
  name: string;
  email: string;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [family, setFamily] = useState<{ id: string; name: string } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [users, setUsers] = useState<FamUser[]>([]);
  const isAdmin = session?.user?.email === "alnuale@gmail.com";

  // Edit states
  const [editingFamily, setEditingFamily] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [editingChild, setEditingChild] = useState<string | null>(null);
  const [childName, setChildName] = useState("");
  const [childBirth, setChildBirth] = useState("");

  // Add user
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  useEffect(() => {
    fetch("/api/children").then(r => r.json()).then(d => {
      if (d.children?.length > 0) {
        const c = d.children[0];
        fetchFamily(c.id);
      }
    }).catch(() => {});
  }, []);

  const fetchFamily = async (childId: string) => {
    const res = await fetch("/api/family");
    if (res.ok) {
      const d = await res.json();
      setFamily(d.family);
      setChildren(d.children || []);
      setUsers(d.users || []);
    }
  };

  const saveFamily = async () => {
    if (!family) return;
    await fetch("/api/family", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: familyName }) });
    setFamily({ ...family, name: familyName });
    setEditingFamily(false);
    toast.success("Aile adı güncellendi");
  };

  const saveChild = async () => {
    if (!editingChild) return;
    await fetch("/api/children", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingChild, name: childName, birthDate: childBirth }) });
    setChildren(prev => prev.map(c => c.id === editingChild ? { ...c, name: childName, birthDate: childBirth } : c));
    setEditingChild(null);
    toast.success("Çocuk bilgileri güncellendi");
  };

  const deleteChild = async (id: string) => {
    if (!confirm("Bu çocuğu ve tüm verilerini silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/children?childId=${id}`, { method: "DELETE" });
    setChildren(prev => prev.filter(c => c.id !== id));
    toast.success("Çocuk silindi");
  };

  const addUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) return;
    const res = await fetch("/api/family/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newUserName, email: newUserEmail, password: newUserPassword }) });
    if (res.ok) {
      const d = await res.json();
      setUsers(prev => [...prev, d.user]);
      setNewUserName(""); setNewUserEmail(""); setNewUserPassword(""); setShowAddUser(false);
      toast.success("Kullanıcı eklendi");
    } else {
      const d = await res.json();
      toast.error(d.error || "Kullanıcı eklenemedi");
    }
  };

  const removeUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı kaldırmak istediğinize emin misiniz?")) return;
    await fetch(`/api/family/users?userId=${userId}`, { method: "DELETE" });
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success("Kullanıcı kaldırıldı");
  };

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-primary">Ayarlar</h1>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
        <h2 className="font-serif text-lg text-on-surface">Aile Bilgileri</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-on-surface-variant w-20">Aile Adı</label>
          {editingFamily ? (
            <div className="flex items-center gap-2 flex-1">
              <input value={familyName} onChange={e => setFamilyName(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-sm" />
              <button onClick={saveFamily} className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center"><Check size={14} /></button>
              <button onClick={() => setEditingFamily(false)} className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center"><X size={14} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <p className="text-on-surface font-medium">{family?.name}</p>
              <button onClick={() => { setFamilyName(family?.name || ""); setEditingFamily(true); }} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-primary"><Pencil size={13} /></button>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-on-surface-variant">Çocuklar</label>
          <div className="space-y-2 mt-2">
            {children.map(c => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low">
                {editingChild === c.id ? (
                  <>
                    <input value={childName} onChange={e => setChildName(e.target.value)} placeholder="Ad" className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm w-32" />
                    <input type="date" value={childBirth} onChange={e => setChildBirth(e.target.value)} className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm" />
                    <button onClick={saveChild} className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center"><Check size={13} /></button>
                    <button onClick={() => setEditingChild(null)} className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center"><X size={13} /></button>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-on-surface flex-1">{c.name} - {new Date(c.birthDate).toLocaleDateString("tr-TR")}</span>
                    <button onClick={() => { setChildName(c.name); setChildBirth(new Date(c.birthDate).toISOString().split("T")[0]); setEditingChild(c.id); }} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-primary"><Pencil size={12} /></button>
                    <button onClick={() => deleteChild(c.id)} className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-error"><Trash2 size={12} /></button>
                  </>
                )}
              </div>
            ))}
            {children.length === 0 && <p className="text-sm text-on-surface-variant">Henüz çocuk eklenmemiş.</p>}
          </div>
        </div>
      </section>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg text-on-surface">Kullanıcılar</h2>
          {isAdmin && (
            <button onClick={() => setShowAddUser(!showAddUser)} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:bg-primary-container/20 px-3 py-1.5 rounded-full">
              <UserPlus size={14} /> Kullanıcı Ekle
            </button>
          )}
        </div>

        {showAddUser && isAdmin && (
          <div className="space-y-2 p-4 bg-surface-container-low rounded-xl">
            <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Ad Soyad" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm" />
            <input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="E-posta" type="email" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm" />
            <input value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="Şifre" type="password" className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm" />
            <button onClick={addUser} className="w-full py-2 rounded-full bg-primary text-on-primary text-sm font-medium">Ekle</button>
          </div>
        )}

        <div className="space-y-2">
          {users.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-medium text-sm">{u.name?.charAt(0).toUpperCase()}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">{u.name}</p>
                <p className="text-xs text-on-surface-variant">{u.email}</p>
              </div>
              {u.id === session?.user?.id ? (
                <span className="text-xs bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full">Sen</span>
              ) : isAdmin && (
                <button onClick={() => removeUser(u.id)} className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant/40 hover:text-error"><Trash2 size={13} /></button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <h2 className="font-serif text-lg text-on-surface mb-4">Yedekleme</h2>
        <p className="text-sm text-on-surface-variant mb-4">Verilerinizi PDF veya metin formatında dışa aktarabilirsiniz.</p>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors">PDF İndir</button>
          <button className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors">Metin İndir</button>
        </div>
      </section>
    </div>
  );
}
