import { z } from "zod";

// 星座枚举
const ZodiacEnum = z.enum([
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
]);

// MBTI 枚举
const MbtiEnum = z.enum([
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);

// 气质关键词枚举
const VibeKeywordEnum = z.enum([
  "rational", // 理性智识
  "gentle", // 温润如玉
  "independent", // 独立自由
  "creative", // 灵感迸发
  "warm", // 温暖亲和
  "restrained", // 克制内敛
  "elegant", // 优雅高贵
  "confident", // 从容自信
]);

// 生肖枚举
export const ChineseZodiacEnum = z.enum([
  "rat", "ox", "tiger", "rabbit", "dragon", "snake",
  "horse", "goat", "monkey", "rooster", "dog", "pig"
]);

/**
 * 生成请求 Schema（按 PRD 设计）
 *
 * 输入维度：
 * - gender（必填）：影响名字在英语文化中的使用频率与性别语境
 * - zodiac（必填）：轻量人格映射，广泛被用户理解
 * - chinese_zodiac（可选）：生肖，增加东方文化维度
 * - mbti（可选）：高阶性格维度，适合愿意深度表达的用户
 * - vibe_keywords（必填）：核心差异化输入，反映用户希望名字传达的价值与气质
 */
export const GenerateRequestSchema = z.object({
  chinese_name: z.string().optional(),
  gender: z.enum(["female", "male", "neutral"]),
  zodiac: ZodiacEnum,
  chinese_zodiac: ChineseZodiacEnum,
  mbti: MbtiEnum.optional(),
  vibe_keywords: z.array(VibeKeywordEnum).min(1).max(2),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/**
 * 名字候选 Schema
 *
 * 每个名字包含：
 * - name：名字本身
 * - pronunciation_ipa：发音（IPA）
 * - origin：来源语言/文化
 * - meaning：含义
 * - one_liner：一句话定位（用户记住名字的"钉子"）
 * - cultural_background：文化背景（简短易读）
 * - nickname：常见昵称
 * - vibe_tags：气质标签（兼容旧数据）
 * - why_fit：为什么适合（兼容旧数据）
 */
export const CandidateSchema = z.object({
  name: z.string().min(1),
  pronunciation_ipa: z.string().optional(),
  origin: z.string().optional(),
  meaning: z.string().optional(),
  one_liner: z.string().optional(),
  cultural_background: z.string().optional(),
  nickname: z.array(z.string()).optional(),
  vibe_tags: z.array(z.string()).optional(),
  why_fit: z.array(z.string()).optional(),
});

export type Candidate = z.infer<typeof CandidateSchema>;

/**
 * 生成响应 Schema
 */
export const GenerateResponseSchema = z.object({
  ok: z.literal(true),
  candidates: z.array(CandidateSchema).min(1),
});

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
