import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: {
      family: {
        include: {
          children: {
            orderBy: { birthDate: "asc" },
            select: { id: true, name: true, birthDate: true, gender: true },
          },
        },
      },
    },
  });

  if (!user?.family) {
    return NextResponse.json({ children: [] });
  }

  return NextResponse.json({ children: user.family.children });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, name, birthDate } = body;
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (name) data.name = name;
  if (birthDate) data.birthDate = new Date(birthDate);

  await prisma.child.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId");
  if (!childId) return NextResponse.json({ error: "childId required" }, { status: 400 });

  await prisma.child.delete({ where: { id: childId } });
  return NextResponse.json({ success: true });
}
