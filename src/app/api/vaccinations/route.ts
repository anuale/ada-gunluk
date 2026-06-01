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

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, administeredAt, notes } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const vaccination = await prisma.vaccination.update({
    where: { id },
    data: {
      administeredAt: administeredAt ? new Date(administeredAt) : new Date(),
      notes: notes ?? undefined,
    },
  });

  return NextResponse.json(vaccination);
}
