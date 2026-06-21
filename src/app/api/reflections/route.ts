import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const date = searchParams.get("date");
    if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

    const where: Record<string, unknown> = { childId };
    if (date) {
      const d = new Date(date);
      where.date = {
        gte: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        lt: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
      };
    }

    const reflections = await prisma.dailyReflection.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return NextResponse.json(reflections);
  } catch (error) {
    console.error("Reflections GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { childId, date, mood, journal } = body;
    if (!childId || !date) return NextResponse.json({ error: "childId and date required" }, { status: 400 });

    const reflection = await prisma.dailyReflection.upsert({
      where: {
        childId_date_userId: { childId, date: new Date(date), userId: session.user.id as string },
      },
      update: { mood: mood ?? null, journal: journal ?? null },
      create: {
        childId,
        userId: session.user.id as string,
        date: new Date(date),
        mood: mood ?? null,
        journal: journal ?? null,
      },
    });

    return NextResponse.json(reflection);
  } catch (error) {
    console.error("Reflections POST error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
