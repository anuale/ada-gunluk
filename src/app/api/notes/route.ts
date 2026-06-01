import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const favorites = searchParams.get("favorites");

  const where: Record<string, unknown> = { familyId: user.familyId };
  if (search) where.content = { contains: search, mode: "insensitive" };
  if (tag) where.tags = { has: tag };
  if (favorites === "true") where.isFavorite = true;

  const notes = await prisma.note.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { name: true } } },
  });
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  const body = await request.json();
  const { title, content, tags, linkedDate, isFavorite } = body;
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const note = await prisma.note.create({
    data: {
      familyId: user.familyId,
      userId: user.id,
      title,
      content: content || "",
      tags: tags || [],
      linkedDate: linkedDate ? new Date(linkedDate) : null,
      isFavorite: isFavorite || false,
    },
  });

  return NextResponse.json(note, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, title, content, tags, linkedDate, isFavorite } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const note = await prisma.note.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
      ...(linkedDate !== undefined && { linkedDate: linkedDate ? new Date(linkedDate) : null }),
      ...(isFavorite !== undefined && { isFavorite }),
    },
  });

  return NextResponse.json(note);
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
