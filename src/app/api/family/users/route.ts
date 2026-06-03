import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/config";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.email !== "alnuale@gmail.com") {
    return NextResponse.json({ error: "Sadece admin kullanıcı ekleyebilir" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, password } = body;
  if (!name || !email || !password) return NextResponse.json({ error: "Tüm alanlar zorunlu" }, { status: 400 });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 400 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  if (!admin?.familyId) return NextResponse.json({ error: "No family" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 12);
  const newUser = await prisma.user.create({ data: { name, email, passwordHash, familyId: admin.familyId } });

  return NextResponse.json({ user: { id: newUser.id, name: newUser.name, email: newUser.email } });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.email !== "alnuale@gmail.com") {
    return NextResponse.json({ error: "Sadece admin kullanıcı silebilir" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  const admin = await prisma.user.findUnique({ where: { id: session.user.id as string } });
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || target.familyId !== admin?.familyId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}
