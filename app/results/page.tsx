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

  const [showPayModal, setShowPayModal] = useState(false);

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

                  {/* Vibe Tags */}
                  {c.vibe_tags && c.vibe_tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.vibe_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600 uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* ② 发音 - 辅助，弱化显示 */}
                  {c.pronunciation_ipa && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        /{c.pronunciation_ipa}/
                      </span>
                      {/* 播放按钮 - 使用 Web Speech API */}
                      <button
                        type="button"
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(
                            c.name
                          );
                          utterance.lang = "en-US";
                          utterance.rate = 0.8; // 稍微慢一点，方便听清
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 active:scale-95 transition-all"
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
                      <p className="mt-1 text-sm leading-relaxed text-neutral-900 font-medium">
                        {c.one_liner}
                      </p>
                    )}
                  </div>

                  {/* ④ 匹配理由 - 深度人格分析列表 */}
                  {c.why_fit && c.why_fit.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {c.why_fit.map((reason, idx) => (
                        <div key={idx} className="flex gap-2 text-sm leading-relaxed text-neutral-600">
                          <span className="text-neutral-300 mt-1 flex-shrink-0">•</span>
                          <p>{reason}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ⑤ 文化背景 - 详尽底蕴 */}
                  {c.cultural_background && (
                    <div className="mt-6 rounded-2xl bg-neutral-50 p-5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                        文化底蕴
                      </h4>
                      <p className="text-sm leading-relaxed text-neutral-600">
                        {c.cultural_background}
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

            {/* 底部收口与商业化转化区 */}
            <section className="mt-20 rounded-3xl bg-neutral-900 p-8 text-center text-white sm:p-12">
              <h3 className="text-xl font-semibold sm:text-2xl">
                想要探索更多可能性？
              </h3>
              <p className="mt-4 text-neutral-400">
                每一个灵魂都有多面性。
                <br />
                登录以解锁无限次精准匹配与深度人格报告。
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => setShowPayModal(true)}
                  className="w-full rounded-2xl bg-white px-8 py-4 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100 active:scale-95 sm:w-auto"
                >
                  ✨ 唤醒更多名字
                </button>
                <button
                  onClick={() => setShowPayModal(true)}
                  className="w-full rounded-2xl border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95 sm:w-auto"
                >
                  ✍️ 调整我的信息
                </button>
              </div>
              
              <p className="mt-8 text-xs text-neutral-500">
                名字只是开始。重要的是，你愿意用它介绍自己。
              </p>
            </section>

            {/* Pay Modal */}
            {showPayModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setShowPayModal(false)}
                />
                <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-neutral-900">
                      开启你的专属命名之旅
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                      我们相信，一个契合的名字值得被认真对待。
                      <br />
                      登录后即可享受：
                    </p>
                    <ul className="mt-6 space-y-3 text-left text-sm text-neutral-600">
                      <li className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 text-[10px]">✓</span>
                        无限次 AI 深度匹配
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 text-[10px]">✓</span>
                        保存并管理你的名字收藏夹
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-900 text-[10px]">✓</span>
                        获取 500 字深度人格与文化报告
                      </li>
                    </ul>
                    <button
                      className="mt-10 w-full rounded-2xl bg-neutral-900 py-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-95 shadow-lg shadow-neutral-200"
                    >
                      立即登录解锁
                    </button>
                    <button
                      onClick={() => setShowPayModal(false)}
                      className="mt-4 text-xs text-neutral-400 hover:text-neutral-600"
                    >
                      稍后再说
                    </button>
                  </div>
                </div>
              </div>
            )}

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
