import { NextResponse } from "next/server";
import {
  GenerateRequestSchema,
  GenerateResponseSchema,
} from "@/app/lib/contracts";

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const input = GenerateRequestSchema.parse(raw);

    // TODO: 下一步接 AI（现在先返回示例数据，展示新的数据结构）
    // 根据用户输入的气质关键词，返回对应风格的名字

    const result = {
      ok: true as const,
      candidates: [
        {
          name: "Elowen",
          pronunciation_ipa: "ɛˈloʊ.ən",
          origin: "康沃尔语",
          meaning: "榆树",
          one_liner: "一个听起来安静，但很有力量的名字。",
          cultural_background:
            "Elowen 源自康沃尔语，是近年来在英美逐渐流行的自然系名字。它既有凯尔特文化的神秘感，又因为发音柔和而显得亲切。在《权力的游戏》等奇幻作品的影响下，这类名字越来越受欢迎。",
          nickname: ["Ellie", "Wen"],
          vibe_tags: input.vibe_keywords,
        },
        {
          name: "Iris",
          pronunciation_ipa: "ˈaɪ.rɪs",
          origin: "希腊语",
          meaning: "彩虹",
          one_liner: "优雅而不张扬，有一种内敛的美。",
          cultural_background:
            "Iris 是希腊神话中彩虹女神的名字，象征着天地之间的信使。这个名字在维多利亚时代因为同名鸢尾花而流行，至今仍是一个经典而不过时的选择。作家 Iris Murdoch 让这个名字增添了知性的气质。",
          nickname: ["Ris"],
          vibe_tags: input.vibe_keywords,
        },
        {
          name: "Thea",
          pronunciation_ipa: "ˈθiː.ə",
          origin: "希腊语",
          meaning: "女神",
          one_liner: "简短有力，发音清脆，容易被记住。",
          cultural_background:
            "Thea 在希腊神话中是光明与视野的女神，是太阳神赫利俄斯的母亲。这个名字虽然有着神圣的背景，但发音简洁现代，在北欧和英美都很受欢迎。它也是 Theodora、Dorothea 等名字的昵称形式。",
          nickname: ["Tee"],
          vibe_tags: input.vibe_keywords,
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
