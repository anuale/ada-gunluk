import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const measurements = await prisma.growthMeasurement.findMany({
    where: { childId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(measurements);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { childId, date, weightKg, heightCm, headCircumferenceCm, notes } = body;
  if (!childId || !date) return NextResponse.json({ error: "childId and date required" }, { status: 400 });

  const measurement = await prisma.growthMeasurement.create({
    data: {
      childId,
      date: new Date(date),
      weightKg: weightKg ?? null,
      heightCm: heightCm ?? null,
      headCircumferenceCm: headCircumferenceCm ?? null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(measurement, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.growthMeasurement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
