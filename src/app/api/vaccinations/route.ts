import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });
  const vaccinations = await prisma.vaccination.findMany({
    where: { childId },
    orderBy: { scheduledDate: "asc" },
  });
  return NextResponse.json(vaccinations);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { childId, vaccineName, doseNumber, scheduledDate, administeredAt, notes } = body;
  if (!childId || !vaccineName) return NextResponse.json({ error: "childId and vaccineName required" }, { status: 400 });

  const vaccination = await prisma.vaccination.create({
    data: {
      childId,
      vaccineKey: `custom-${Date.now()}`,
      vaccineName,
      doseNumber: doseNumber || 1,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      administeredAt: administeredAt ? new Date(administeredAt) : null,
      notes: notes ?? null,
    },
  });
  return NextResponse.json(vaccination, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const { id, administeredAt, notes } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const vaccination = await prisma.vaccination.update({
    where: { id },
    data: {
      administeredAt: administeredAt === null ? null : administeredAt ? new Date(administeredAt) : new Date(),
      notes: notes ?? undefined,
    },
  });
  return NextResponse.json(vaccination);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.vaccination.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
