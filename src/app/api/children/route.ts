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
