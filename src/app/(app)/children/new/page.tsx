import { auth } from "@/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { milestoneTemplates } from "@/lib/data/milestones";
import { vaccineTemplates } from "@/lib/data/vaccines";

export default function NewChildPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl text-primary mb-6">Yeni Çocuk Ekle</h1>
      <form action={createChild} className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-on-surface mb-1.5">
            Adı
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            placeholder="Çocuğun adı"
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-on-surface mb-1.5">
            Doğum Tarihi
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            required
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-on-surface mb-1.5">
            Cinsiyeti
          </label>
          <select
            id="gender"
            name="gender"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
          >
            <option value="">Belirtilmedi</option>
            <option value="female">Kız</option>
            <option value="male">Erkek</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-primary text-on-primary font-medium text-sm hover:bg-surface-tint transition-colors"
        >
          Çocuğu Ekle
        </button>
      </form>
    </div>
  );
}

async function createChild(formData: FormData) {
  "use server";

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = formData.get("name") as string;
  const birthDate = formData.get("birthDate") as string;
  const gender = formData.get("gender") as string;

  if (!name || !birthDate) return;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
  });

  if (!user) redirect("/login");

  const birth = new Date(birthDate);
  const child = await prisma.child.create({
    data: {
      name,
      birthDate: birth,
      gender: gender || null,
      familyId: user.familyId,
    },
  });

  const now = new Date();
  const ageInMonths = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

  const milestonesForAge = milestoneTemplates.filter((m) => m.ageMonth <= ageInMonths + 12);
  for (const m of milestonesForAge) {
    await prisma.milestone.create({
      data: {
        childId: child.id,
        category: m.category,
        milestoneKey: m.key,
        title: m.title,
        description: m.description,
        ageMonth: m.ageMonth,
      },
    });
  }

  for (const v of vaccineTemplates) {
    const scheduledDate = new Date(birth);
    scheduledDate.setMonth(scheduledDate.getMonth() + v.ageMonth);
    await prisma.vaccination.create({
      data: {
        childId: child.id,
        vaccineKey: v.key,
        vaccineName: v.name,
        doseNumber: v.doseNumber,
        scheduledDate,
      },
    });
  }

  revalidatePath("/children");
  redirect("/dashboard");
}
