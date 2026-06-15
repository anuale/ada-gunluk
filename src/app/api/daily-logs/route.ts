import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  const date = searchParams.get("date");
  const type = searchParams.get("type");

  if (!childId) {
    return NextResponse.json({ error: "childId required" }, { status: 400 });
  }

  const where: Record<string, unknown> = { childId };

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    where.logDate = { gte: startOfDay, lte: endOfDay };
  }

  if (type) {
    where.type = type;
  }

  const logs = await prisma.dailyLog.findMany({
    where,
    orderBy: { startedAt: "asc" },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(logs);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { childId, type, logDate, startedAt, endedAt, data, notes } = body;

  if (!childId || !type) {
    return NextResponse.json(
      { error: "childId and type required" },
      { status: 400 }
    );
  }

  const log = await prisma.dailyLog.create({
    data: {
      childId,
      userId: session.user.id as string,
      type,
      logDate: logDate ? new Date(logDate) : new Date(),
      startedAt: startedAt ? new Date(startedAt) : null,
      endedAt: endedAt ? new Date(endedAt) : null,
      data: data || undefined,
      notes: notes || null,
    },
  });

  return NextResponse.json(log, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, type, logDate, startedAt, endedAt, data, notes } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const log = await prisma.dailyLog.update({
    where: { id },
    data: {
      type: type || undefined,
      logDate: logDate ? new Date(logDate) : undefined,
      startedAt: startedAt ? new Date(startedAt) : undefined,
      endedAt: endedAt ? new Date(endedAt) : undefined,
      data: data !== undefined ? data : undefined,
      notes: notes !== undefined ? notes : undefined,
    },
  });

  return NextResponse.json(log);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await prisma.dailyLog.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
