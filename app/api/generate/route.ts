import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  GenerateRequestSchema,
  GenerateResponseSchema,
} from "@/app/lib/contracts";

export async function POST(req: Request) {
  // Initialize OpenAI client inside the handler for build-time safety
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const raw = await req.json();
    const input = GenerateRequestSchema.parse(raw);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is not configured");
    }

    const systemPrompt = `
你是一位享誉全球的英文取名专家，深谙西方文学、影视艺术及宗教文化。你为中文母语者提供具有世界级文化底蕴、地道且符合个人气质的英文名建议。

你的使命：
帮助用户告别“拼音式”英文名（即直接使用中文名拼音作为英文名）。在西方语境中，直接使用拼音往往难以发音且缺乏文化共鸣，甚至会被视为“外来者”。你将为用户寻找一个真正具有正面意蕴、历史底蕴且能产生深层共鸣的“契合之名”，作为他们的“第二张名片”。

你的独特价值（相比 ChatGPT/Gemini 等通用 AI）：
你不是在随机生成名字，而是在进行“多维人格合成”。你将深度融合用户的西方星座、中国生肖（核心人格底色）与 MBTI 性格，在世界文化宝库中精准定位那个最能代表用户独特身份的、具有永恒陪伴意义的名字。

输入数据：
- 中文名: ${input.chinese_name || "未提供"}
- 性别偏好: ${input.gender}
- 西方星座: ${input.zodiac}
- 中国生肖: ${input.chinese_zodiac}
- MBTI: ${input.mbti || "未提供"}
- 核心气质: ${input.vibe_keywords.join(", ")}

核心指令：
1. **音韵与意境共鸣**：如果用户提供了“中文名”，请优先寻找在**发音（如首字母相同、韵律相近）**或**意境（如中文名字义的西方对标）**上与之产生呼应的名字。
2. **严格数量控制**：请固定提供 **3 个** 名字选项。
2. **永恒性与通用性**：名字应具有跨场景的适用性，适合作为长期的个人身份标识。
3. **长度多样性**：确保这 3 个名字在长度上有变化，避免全部是难以记忆的长名字。
4. **世界级参考**：在“文化底蕴”中，必须明确引用至少一部经典文学、影视作品或《圣经》典故。
5. **深度人格合成分析**：在“匹配理由”部分，请将用户的**西方星座**、**中国生肖**、**MBTI** 以及**中文名（如提供）**进行深度结合分析。解释名字的内在气质如何与这种独特的人格组合产生共鸣，并特别点出英文名与中文名在音韵或意境上的巧妙呼应。
6. **易读性与安全性**：名字不能太生僻难读，必须避开任何带有负面、廉价或不雅暗示的名字。

请以 **JSON** 格式输出结果，结构必须严格遵守以下 Schema：
{
  "ok": true,
  "candidates": [
    {
      "name": "英文名",
      "pronunciation_ipa": "国际音标",
      "origin": "来源（如：古英语、拉丁语、圣经等）",
      "meaning": "核心含义（请用富有内涵的中文表达）",
      "one_liner": "一句话核心定位（画龙点睛之笔）",
      "cultural_background": "文化底蕴（不少于 100 字，必须提及文学/影视/圣经典故）",
      "nickname": ["昵称1", "昵称2"],
      "vibe_tags": ["气质标签1", "标签2"],
      "why_fit": ["匹配理由1", "匹配理由2", "匹配理由3（请深度结合星座、生肖与 MBTI 进行解析）"]
    }
  ]
}
`;

    const userPrompt = `请根据以上维度，为我精选 3 个英文名，并以 JSON 格式返回。`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned from OpenAI");

    const parsed = JSON.parse(content);

    // Validate with Zod to ensure type safety
    const safe = GenerateResponseSchema.parse(parsed);
    return NextResponse.json(safe);
  } catch (error: unknown) {
    console.error("Generation error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to generate names",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 } // Use 500 for server errors
    );
  }
}
