import { NextResponse } from "next/server";
import { auth } from "@/auth/config";
import { prisma } from "@/lib/prisma";
import {
  deepseekChat,
  BOOK_KNOWLEDGE,
  REFLECTION_ANALYSIS_PROMPT,
  WEEKLY_ANALYSIS_PROMPT,
} from "@/lib/ai/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { type: analysisType } = body;
  let { childId } = body;

  if (!analysisType) return NextResponse.json({ error: "type required" }, { status: 400 });

  if (!childId) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { family: { include: { children: { take: 1, orderBy: { birthDate: "asc" } } } } },
    });
    if (user?.family?.children[0]) {
      childId = user.family.children[0].id;
    }
  }

  if (!childId) return NextResponse.json({ analysis: "Analiz için önce bir çocuk profili ekleyin." });

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { name: true, birthDate: true },
  });

  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  const now = new Date();
  const ageInMonths = Math.floor(
    (now.getTime() - new Date(child.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );

  try {
    if (analysisType === "reflection") {
      const reflection = await prisma.dailyReflection.findFirst({
        where: { childId, date: { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) } },
        orderBy: { date: "desc" },
      });

      if (!reflection?.journal) {
        return NextResponse.json({ analysis: "Bugün için henüz bir günlük yazısı yok." });
      }

      const result = await deepseekChat([
        { role: "system", content: BOOK_KNOWLEDGE + "\n\n" + REFLECTION_ANALYSIS_PROMPT },
        {
          role: "user",
          content: `${child.name} ${ageInMonths} aylık. Bugünün günlüğü:\n"${reflection.journal}"\n\nRuh hali: ${reflection.mood}/5`,
        },
      ]);

      await prisma.dailyReflection.update({
        where: { id: reflection.id },
        data: { aiFeedback: result },
      });

      await prisma.aIAnalysis.create({
        data: {
          childId,
          analysisType: "reflection",
          periodStart: now,
          periodEnd: now,
          inputData: { journal: reflection.journal, mood: reflection.mood },
          response: result,
        },
      });

      return NextResponse.json({ analysis: result });
    }

    if (analysisType === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const logs = await prisma.dailyLog.findMany({
        where: { childId, logDate: { gte: weekAgo } },
        orderBy: { logDate: "asc" },
        select: { type: true, startedAt: true, endedAt: true, data: true },
      });

      const reflections = await prisma.dailyReflection.findMany({
        where: { childId, date: { gte: weekAgo } },
        orderBy: { date: "asc" },
        select: { date: true, mood: true, journal: true },
      });

      const summary = {
        feeds: logs.filter((l) => l.type === "feeding").length,
        sleeps: logs.filter((l) => l.type === "sleep").length,
        diapers: logs.filter((l) => l.type === "diaper").length,
        ecs: logs.filter((l) => l.type === "ec").length,
        avgMood: reflections.length
          ? Math.round(reflections.reduce((sum, r) => sum + (r.mood || 0), 0) / reflections.length)
          : null,
      };

      const result = await deepseekChat([
        { role: "system", content: BOOK_KNOWLEDGE + "\n\n" + WEEKLY_ANALYSIS_PROMPT },
        {
          role: "user",
          content: `${child.name} ${ageInMonths} aylık. Son 7 gün:\nBeslenme: ${summary.feeds}, Uyku: ${summary.sleeps}, Bez: ${summary.diapers}, EC: ${summary.ecs}\nOrtalama ruh hali: ${summary.avgMood || "?"}/5`,
        },
      ]);

      await prisma.aIAnalysis.create({
        data: {
          childId,
          analysisType: "weekly",
          periodStart: weekAgo,
          periodEnd: now,
          inputData: summary as unknown as Parameters<typeof prisma.aIAnalysis.create>[0]["data"]["inputData"],
          response: result,
        },
      });

      return NextResponse.json({ analysis: result });
    }

    if (analysisType === "monthly") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const milestones = await prisma.milestone.findMany({
        where: { childId },
        select: { title: true, achievedAt: true, ageMonth: true },
      });

      const achieved = milestones.filter((m) => m.achievedAt).length;

      const result = await deepseekChat([
        { role: "system", content: BOOK_KNOWLEDGE },
        {
          role: "user",
          content: `${child.name} ${ageInMonths} aylık için aylık gelişim özeti oluştur. Tamamlanan kilometre taşları: ${achieved}/${milestones.length}. Önümüzdeki ay için 2-3 gelişimsel tavsiye ver.`,
        },
      ]);

      await prisma.aIAnalysis.create({
        data: {
          childId,
          analysisType: "monthly",
          periodStart: monthAgo,
          periodEnd: now,
          inputData: { achieved, total: milestones.length },
          response: result,
        },
      });

      return NextResponse.json({ analysis: result });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { analysis: "Analiz şu anda yapılamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
