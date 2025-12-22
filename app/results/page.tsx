"use client";

import Link from "next/link";
import { useState } from "react";

// 名字候选类型定义
type Candidate = {
  name: string;
  pronunciation_ipa?: string;
  origin?: string; // 源自（如：康沃尔语）
  meaning?: string; // 含义（如：榆树）
  one_liner?: string; // 一句话定位（如：一个听起来安静，但很有力量的名字）
  cultural_background?: string; // 文化背景（简短易读的一段话）
  nickname?: string[];
  vibe_tags?: string[];
  why_fit?: string[];
};

type GenerateResponse = {
  ok: boolean;
  candidates: Candidate[];
};

export default function ResultsPage() {
  // 使用 useState 的初始化函数，只在组件首次渲染时执行（客户端）
  const [data] = useState<GenerateResponse | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("menei:last_result");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-14">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-neutral-900"
          >
            myenglishnameis.com
          </Link>
        </header>

        {/* 无结果状态 */}
        {!data?.ok ? (
          <section className="mt-20 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              还没有找到结果
            </h1>
            <p className="mt-4 text-sm text-neutral-600">
              请回到首页，告诉我们你的偏好，我们会为你精心挑选。
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              开始生成
            </Link>
          </section>
        ) : (
          <>
            {/* 结果页顶部文案 */}
            <section className="mt-16">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                这是为你精心挑选的英文名。
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                每一个名字，都有它适合你的理由。
                <br />
                你可以慢慢看，慢慢感受。
              </p>
            </section>

            {/* 名字卡片列表 */}
            <section className="mt-12 space-y-6">
              {data.candidates.map((c) => (
                <article
                  key={c.name}
                  className="rounded-3xl border border-neutral-200 p-6 sm:p-8"
                >
                  {/* ① 名字本身 - 最克制，名字就是主角 */}
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {c.name}
                  </h2>

                  {/* ② 发音 - 辅助，弱化显示 */}
                  {c.pronunciation_ipa && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        /{c.pronunciation_ipa}/
                      </span>
                      {/* 播放按钮占位 - 未来可接入 TTS */}
                      <button
                        type="button"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                        aria-label="播放发音"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* ③ 源自 + 一句话定位 - 用户记住名字的"钉子" */}
                  <div className="mt-6">
                    {(c.origin || c.meaning) && (
                      <p className="text-sm leading-relaxed text-neutral-700">
                        {c.origin && c.meaning
                          ? `源自${c.origin}，意为"${c.meaning}"。`
                          : c.origin
                          ? `源自${c.origin}。`
                          : null}
                      </p>
                    )}
                    {c.one_liner && (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-900">
                        {c.one_liner}
                      </p>
                    )}
                    {/* 兼容旧数据：如果没有 one_liner，用 why_fit 的第一条 */}
                    {!c.one_liner && c.why_fit?.[0] && (
                      <p className="mt-1 text-sm leading-relaxed text-neutral-900">
                        {c.why_fit[0]}
                      </p>
                    )}
                  </div>

                  {/* ④ 文化背景 - 简短易读的一段话 */}
                  {c.cultural_background && (
                    <div className="mt-6">
                      <p className="text-sm leading-relaxed text-neutral-600">
                        {c.cultural_background}
                      </p>
                    </div>
                  )}
                  {/* 兼容旧数据：如果没有 cultural_background，用 why_fit 的其他条目 */}
                  {!c.cultural_background &&
                    c.why_fit &&
                    c.why_fit.length > 1 && (
                      <div className="mt-6">
                        <p className="text-sm leading-relaxed text-neutral-600">
                          {c.why_fit.slice(1).join(" ")}
                        </p>
                      </div>
                    )}

                  {/* ⑤ 昵称 - "我真的能用它"的信号 */}
                  {c.nickname && c.nickname.length > 0 && (
                    <div className="mt-6 border-t border-neutral-100 pt-4">
                      <p className="text-sm text-neutral-500">
                        常见昵称：
                        <span className="text-neutral-700">
                          {c.nickname.join(" / ")}
                        </span>
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </section>

            {/* 底部收口文案 */}
            <section className="mt-16 text-center">
              <p className="text-base leading-relaxed text-neutral-600">
                名字只是开始。
                <br />
                重要的是，你愿意用它介绍自己。
              </p>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-block rounded-2xl border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  再看看其他名字
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-16 border-t border-neutral-100 pt-8 text-center text-sm text-neutral-400">
              © {new Date().getFullYear()} MyEnglishNameIs
            </footer>
          </>
        )}
      </div>
    </main>
  );
}
