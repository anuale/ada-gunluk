import { NextResponse } from "next/server";
import { auth } from "@/auth/config";
import { deepseekChat, BOOK_KNOWLEDGE } from "@/lib/ai/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { messages, childContext } = body;

  if (!messages?.length) return NextResponse.json({ error: "messages required" }, { status: 400 });

  const contextInfo = childContext
    ? `Bağlam: ${childContext.name || "Çocuk"} ${childContext.ageMonths || 0} aylık.`
    : "";

  const systemPrompt = BOOK_KNOWLEDGE + "\n\n" + contextInfo;

  const result = await deepseekChat(
    [
      { role: "system", content: systemPrompt },
      ...messages.map((m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ],
    { maxTokens: 800 }
  );

  return NextResponse.json({ reply: result });
}
