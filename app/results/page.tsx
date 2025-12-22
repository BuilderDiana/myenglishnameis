"use client";

import Link from "next/link";
import { useState } from "react";

type Candidate = {
  name: string;
  pronunciation_ipa?: string;
  nickname?: string[];
  origin?: string;
  vibe_tags?: string[];
  why_fit?: string[];
};

type GenerateResponse = {
  ok: boolean;
  candidates: Candidate[];
};

export default function ResultsPage() {
  // 使用 useState 的初始化函数，只在组件首次渲染时执行（客户端）
  // setData 虽然未使用，但保持 useState 的结构，方便未来扩展
  const [data] = useState<GenerateResponse | null>(() => {
    if (typeof window === "undefined") return null; // 服务端渲染检查
    const raw = sessionStorage.getItem("menei:last_result");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your results</h1>
        <Link
          href="/"
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          ← Back
        </Link>
      </div>

      {!data?.ok ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 p-4 text-sm text-neutral-700">
          没有找到结果。请回到首页填写表单再生成一次。
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {data.candidates.map((c) => (
            <div
              key={c.name}
              className="rounded-2xl border border-neutral-200 p-4"
            >
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-lg font-semibold">{c.name}</div>
                {c.pronunciation_ipa && (
                  <div className="text-sm text-neutral-600">
                    /{c.pronunciation_ipa}/
                  </div>
                )}
              </div>

              {c.origin && (
                <div className="mt-2 text-sm text-neutral-600">
                  Origin: {c.origin}
                </div>
              )}

              {c.nickname?.length ? (
                <div className="mt-2 text-sm text-neutral-600">
                  Nicknames: {c.nickname.join(", ")}
                </div>
              ) : null}

              {c.vibe_tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.vibe_tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {c.why_fit?.length ? (
                <ul className="mt-3 list-disc pl-5 text-sm text-neutral-800">
                  {c.why_fit.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
