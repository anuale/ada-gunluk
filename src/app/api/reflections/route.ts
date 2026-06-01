import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";
import {
  deepseekChat,
  BOOK_KNOWLEDGE,
  REFLECTION_ANALYSIS_PROMPT,
} from "@/lib/ai/client";

export async function GET(request: Request) {
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
}

export async function POST(request: Request) {
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

  let aiFeedback: string | null = null;

  if (journal) {
    try {
      const child = await prisma.child.findUnique({
        where: { id: childId },
        select: { name: true, birthDate: true },
      });

      if (child) {
        const ageInMonths = Math.floor(
          (new Date().getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        );

        const result = await deepseekChat([
          { role: "system", content: BOOK_KNOWLEDGE + "\n\n" + REFLECTION_ANALYSIS_PROMPT },
          {
            role: "user",
            content: `${child.name} ${ageInMonths} aylık. Bugünün günlüğü:\n"${journal}"\n\nRuh hali: ${mood || "?"}/5`,
          },
        ]);

        aiFeedback = result;

        await prisma.$transaction([
          prisma.dailyReflection.update({
            where: { id: reflection.id },
            data: { aiFeedback: result },
          }),
          prisma.aIAnalysis.create({
            data: {
              childId,
              analysisType: "reflection",
              periodStart: new Date(),
              periodEnd: new Date(),
              inputData: { journal, mood },
              response: result,
            },
          }),
        ]);
      }
    } catch (err) {
      console.error("AI feedback generation failed:", err);
    }
  }

  return NextResponse.json({ ...reflection, aiFeedback });
}
