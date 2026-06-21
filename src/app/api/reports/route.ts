import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id as string } });
    if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

    const reports = await prisma.report.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("reports GET error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      include: { family: { include: { children: true } } },
    });
    if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

    const body = await request.json();
    const { childId, reportType, periodStart, periodEnd, format } = body;

    if (!childId || !reportType || !periodStart || !periodEnd) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(periodStart);
    const end = new Date(periodEnd);

    const [logs, reflections, milestones, measurements, vaccinations, aiAnalyses] = await Promise.all([
      prisma.dailyLog.findMany({
        where: { childId, logDate: { gte: start, lte: end } },
        orderBy: { logDate: "asc" },
      }),
      prisma.dailyReflection.findMany({
        where: { childId, date: { gte: start, lte: end } },
        orderBy: { date: "asc" },
      }),
      prisma.milestone.findMany({
        where: { childId, achievedAt: { gte: start, lte: end } },
      }),
      prisma.growthMeasurement.findMany({
        where: { childId, date: { gte: start, lte: end } },
        orderBy: { date: "asc" },
      }),
      prisma.vaccination.findMany({
        where: { childId, administeredAt: { gte: start, lte: end } },
      }),
      prisma.aIAnalysis.findMany({
        where: { childId, periodStart: { gte: start }, periodEnd: { lte: end } },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const reportData = {
      reportType,
      period: { start: periodStart, end: periodEnd },
      logs: {
        feeding: logs.filter((l) => l.type === "feeding").length,
        sleep: logs.filter((l) => l.type === "sleep").length,
        diaper: logs.filter((l) => l.type === "diaper").length,
        ec: logs.filter((l) => l.type === "ec").length,
        total: logs.length,
      },
      reflections: reflections.map((r) => ({
        date: r.date,
        mood: r.mood,
        journal: r.journal,
        aiFeedback: r.aiFeedback,
      })),
      milestones: milestones.map((m) => ({ title: m.title, date: m.achievedAt })),
      growth: measurements.map((m) => ({
        date: m.date,
        weight: m.weightKg,
        height: m.heightCm,
        head: m.headCircumferenceCm,
      })),
      vaccinations: vaccinations.map((v) => ({ name: v.vaccineName, date: v.administeredAt })),
      aiInsights: aiAnalyses.map((a) => a.response),
    };

    const report = await prisma.report.create({
      data: {
        familyId: user.familyId,
        reportType,
        periodStart: start,
        periodEnd: end,
        format: format || "text",
      },
    });

    const formatLabel = format === "pdf" ? "PDF" : "Metin";
    const content = generateReportContent(reportData, formatLabel);

    return NextResponse.json({
      report: { ...report, content },
      data: reportData,
    });
  } catch (error) {
    console.error("reports POST error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

function generateReportContent(data: Record<string, unknown>, format: string): string {
  const d = data as Record<string, unknown>;
  const reportData = d.data as Record<string, unknown>;
  const logs = reportData?.logs as Record<string, number>;
  const reflections = reportData?.reflections as Array<{ date: string; mood: number; journal: string | null; aiFeedback: string | null }>;
  const milestones = reportData?.milestones as Array<{ title: string; date: string }>;
  const aiInsights = reportData?.aiInsights as string[];

  const fmtDate = (date: Date) => date.toLocaleDateString("tr-TR");
  const start = new Date((d as { period: { start: string; end: string } }).period.start);
  const end = new Date((d as { period: { start: string; end: string } }).period.end);

  let report = `# Ada'nın Günlüğü - ${fmtDate(start)} - ${fmtDate(end)}\n\n`;

  report += `## Günlük Takip Özeti\n`;
  report += `- Toplam kayıt: ${logs?.total || 0}\n`;
  report += `- Beslenme: ${logs?.feeding || 0}\n`;
  report += `- Uyku: ${logs?.sleep || 0}\n`;
  report += `- Bez: ${logs?.diaper || 0}\n`;
  report += `- Tuvalet İletişimi: ${logs?.ec || 0}\n\n`;

  if (reflections?.length) {
    report += `## Gün Sonu Yansımaları\n`;
    reflections.forEach((r) => {
      const d = new Date(r.date);
      report += `### ${fmtDate(d)} (Ruh Hali: ${"⭐".repeat(r.mood || 3)})\n`;
      if (r.journal) report += `${r.journal}\n`;
      if (r.aiFeedback) report += `\n💡 AI Yorumu: ${r.aiFeedback}\n`;
      report += "\n";
    });
  }

  if (milestones?.length) {
    report += `## Tamamlanan Kilometre Taşları\n`;
    milestones.forEach((m) => {
      report += `- ✓ ${m.title} (${new Date(m.date).toLocaleDateString("tr-TR")})\n`;
    });
    report += "\n";
  }

  if (aiInsights?.length) {
    report += `## AI İçgörüleri\n`;
    aiInsights.forEach((insight) => {
      report += `> ${insight}\n\n`;
    });
  }

  report += `\n---\n*Bu rapor Ada'nın Günlüğü tarafından ${fmtDate(new Date())} tarihinde oluşturulmuştur.*`;
  return report;
}
