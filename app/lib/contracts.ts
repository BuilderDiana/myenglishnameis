import { z } from "zod";

export const GenerateRequestSchema = z.object({
  chinese_name: z.string().trim().max(40).optional().default(""),
  pinyin: z.string().trim().max(60).optional().default(""),
  gender: z.enum(["female", "male", "neutral"]),
  scene: z.enum(["work", "study", "social"]),
  weights: z.object({
    rare: z.number().min(0).max(100),
    cute: z.number().min(0).max(100),
  }),
  vibe: z.array(z.string()).max(10).default([]),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

export const CandidateSchema = z.object({
  name: z.string().min(1),
  pronunciation_ipa: z.string().optional(),
  nickname: z.array(z.string()).optional(),
  origin: z.string().optional(),
  vibe_tags: z.array(z.string()).optional(),
  why_fit: z.array(z.string()).optional(),
});

export const GenerateResponseSchema = z.object({
  ok: z.literal(true),
  candidates: z.array(CandidateSchema).min(1),
});

export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
