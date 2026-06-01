import { auth } from "@/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ChildrenPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { family: { include: { children: true } } },
  });

  if (!user?.family) redirect("/login");

  const children = user.family.children;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-primary">Çocuklar</h1>
        <a
          href="/children/new"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
        >
          + Yeni Çocuk Ekle
        </a>
      </div>

      {children.length === 0 ? (
        <div className="bg-surface rounded-2xl p-12 shadow-sm border border-outline-variant/10 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="font-serif text-lg text-on-surface mb-2">
            Henüz bir çocuk eklenmedi
          </h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Takibe başlamak için ilk çocuğu ekleyin.
          </p>
          <a
            href="/children/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full text-sm font-medium hover:bg-surface-tint transition-colors"
          >
            İlk Çocuğu Ekle
          </a>
        </div>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => {
            const age = getAgeString(new Date(child.birthDate));
            return (
              <div
                key={child.id}
                className="bg-surface rounded-2xl p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-serif text-xl font-bold">
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-on-surface">
                    {child.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {child.birthDate.toLocaleDateString("tr-TR")} • {age}
                  </p>
                </div>
                <a
                  href={`/children/${child.id}`}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Profili Gör
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getAgeString(birthDate: Date): string {
  const now = new Date();
  const years = now.getFullYear() - birthDate.getFullYear();
  const months = now.getMonth() - birthDate.getMonth();
  const days = now.getDate() - birthDate.getDate();
  const totalMonths = years * 12 + months + (days < 0 ? -1 : 0);
  const adjustedDays = days < 0
    ? new Date(now.getFullYear(), now.getMonth(), 0).getDate() + days
    : days;

  if (totalMonths < 1) {
    return `${adjustedDays} günlük`;
  }
  if (totalMonths < 24) {
    return `${totalMonths} aylık`;
  }
  return `${years} yaş ${totalMonths % 12} aylık`;
}
