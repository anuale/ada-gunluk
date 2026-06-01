import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  const milestones = await prisma.milestone.findMany({
    where: { childId },
    orderBy: { ageMonth: "asc" },
  });

  return NextResponse.json(milestones);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, achievedAt, notes } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const milestone = await prisma.milestone.update({
    where: { id },
    data: {
      achievedAt: achievedAt ? new Date(achievedAt) : new Date(),
      notes: notes ?? undefined,
    },
  });

  return NextResponse.json(milestone);
}
