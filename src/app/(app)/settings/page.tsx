import { auth } from "@/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { family: { include: { users: true, children: true } } },
  });

  if (!user?.family) redirect("/login");

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-primary">Ayarlar</h1>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
        <h2 className="font-serif text-lg text-on-surface">Aile Bilgileri</h2>
        <div>
          <label className="text-sm text-on-surface-variant">Aile Adı</label>
          <p className="text-on-surface font-medium">{user.family.name}</p>
        </div>
        <div>
          <label className="text-sm text-on-surface-variant">Çocuklar</label>
          <ul className="space-y-1 mt-1">
            {user.family.children.map((child) => (
              <li key={child.id} className="text-on-surface flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {child.name} - {new Date(child.birthDate).toLocaleDateString("tr-TR")}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
        <h2 className="font-serif text-lg text-on-surface">Kullanıcılar</h2>
        <div className="space-y-3">
          {user.family.users.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low"
            >
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-medium text-sm">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-on-surface">{u.name}</p>
                <p className="text-xs text-on-surface-variant">{u.email}</p>
              </div>
              {u.id === user.id && (
                <span className="text-xs bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full">
                  Sen
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
        <h2 className="font-serif text-lg text-on-surface mb-4">Yedekleme</h2>
        <p className="text-sm text-on-surface-variant mb-4">
          Verilerinizi PDF veya metin formatında dışa aktarabilirsiniz.
        </p>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors">
            PDF İndir
          </button>
          <button className="px-5 py-2.5 rounded-full border border-outline-variant text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors">
            Metin İndir
          </button>
        </div>
      </section>
    </div>
  );
}
