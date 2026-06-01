import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const visits = await prisma.doctorVisit.findMany({
    where: { childId },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(visits);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { childId, date, doctorName, reason, weightKg, heightCm, headCircumferenceCm, notes } = body;
  if (!childId || !date) return NextResponse.json({ error: "childId and date required" }, { status: 400 });

  const visit = await prisma.doctorVisit.create({
    data: {
      childId,
      date: new Date(date),
      doctorName: doctorName ?? null,
      reason: reason ?? null,
      weightKg: weightKg ?? null,
      heightCm: heightCm ?? null,
      headCircumferenceCm: headCircumferenceCm ?? null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(visit, { status: 201 });
}
