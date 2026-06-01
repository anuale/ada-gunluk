import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";
import { milestoneTemplates } from "@/lib/data/milestones";
import { vaccineTemplates } from "@/lib/data/vaccines";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { childId, birthDate } = body;

  if (!childId || !birthDate) {
    return NextResponse.json({ error: "childId and birthDate required" }, { status: 400 });
  }

  const birth = new Date(birthDate);
  const now = new Date();
  const ageInMonths = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

  const milestonesToCreate = milestoneTemplates.filter((m) => m.ageMonth <= ageInMonths + 12);

  for (const m of milestonesToCreate) {
    await prisma.milestone.upsert({
      where: { childId_milestoneKey: { childId, milestoneKey: m.key } },
      update: {},
      create: {
        childId,
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

    await prisma.vaccination.upsert({
      where: { childId_vaccineKey_doseNumber: { childId, vaccineKey: v.key, doseNumber: v.doseNumber } },
      update: {},
      create: {
        childId,
        vaccineKey: v.key,
        vaccineName: v.name,
        doseNumber: v.doseNumber,
        scheduledDate,
      },
    });
  }

  return NextResponse.json({ success: true, milestonesCreated: milestonesToCreate.length });
}
