import { NextResponse } from "next/server";
import { GenerateRequestSchema, GenerateResponseSchema } from "@/app/lib/contracts";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const input = GenerateRequestSchema.parse(raw);

    // TODO: 下一步接 AI（现在先返回假数据，但会用 input 参与生成逻辑）
    const result = {
      ok: true as const,
      candidates: [
        {
          name: "Elowen",
          pronunciation_ipa: "ɛˈloʊ.ən",
          nickname: ["Ellie", "Wen"],
          origin: "Cornish",
          vibe_tags: ["rare", "cute", "warm", input.scene],
          why_fit: ["独特但不怪", "发音柔和，亲和力强"],
        },
        {
          name: "Juniper",
          pronunciation_ipa: "ˈdʒuː.nɪ.pər",
          nickname: ["Juni"],
          origin: "English (nature name)",
          vibe_tags: ["rare", "playful", "fresh", input.scene],
          why_fit: ["可爱又有记忆点", "偏小众但容易被接受"],
        },
      ],
    };

    // 输出也做校验：保证前端永远拿到稳定结构（production 必备）
    const safe = GenerateResponseSchema.parse(result);
    return NextResponse.json(safe);
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: "Bad Request",
        message: err instanceof Error ? err.message : "Invalid input",
      },
      { status: 400 }
    );
  }
}
