import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: { family: { include: { users: { select: { id: true, name: true, email: true } }, children: { orderBy: { birthDate: "asc" } } } } },
  });
  if (!user?.family) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ family: { id: user.family.id, name: user.family.name }, children: user.family.children, users: user.family.users });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  if (!user?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  await prisma.family.update({ where: { id: user.familyId }, data: { name } });
  return NextResponse.json({ success: true });
}
