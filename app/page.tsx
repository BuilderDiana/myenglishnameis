"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 星座列表
const ZODIAC_SIGNS = [
  { value: "aries", label: "白羊座", en: "Aries" },
  { value: "taurus", label: "金牛座", en: "Taurus" },
  { value: "gemini", label: "双子座", en: "Gemini" },
  { value: "cancer", label: "巨蟹座", en: "Cancer" },
  { value: "leo", label: "狮子座", en: "Leo" },
  { value: "virgo", label: "处女座", en: "Virgo" },
  { value: "libra", label: "天秤座", en: "Libra" },
  { value: "scorpio", label: "天蝎座", en: "Scorpio" },
  { value: "sagittarius", label: "射手座", en: "Sagittarius" },
  { value: "capricorn", label: "摩羯座", en: "Capricorn" },
  { value: "aquarius", label: "水瓶座", en: "Aquarius" },
  { value: "pisces", label: "双鱼座", en: "Pisces" },
];

// MBTI 类型
const MBTI_TYPES = [
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
];

// 气质关键词选项
const VIBE_KEYWORDS = [
  { value: "rational", label: "理性", desc: "冷静、逻辑清晰" },
  { value: "gentle", label: "温和", desc: "亲切、不具攻击性" },
  { value: "independent", label: "独立", desc: "自主、有主见" },
  { value: "creative", label: "创造力", desc: "有想象力、不走寻常路" },
  { value: "warm", label: "亲和", desc: "好相处、让人放松" },
  { value: "restrained", label: "克制", desc: "内敛、有分寸感" },
  { value: "elegant", label: "优雅", desc: "有品味、不张扬" },
  { value: "confident", label: "自信", desc: "从容、有气场" },
];

type Candidate = {
  name: string;
  pronunciation_ipa?: string;
  nickname?: string[];
  origin?: string;
  meaning?: string;
  one_liner?: string;
  cultural_background?: string;
  vibe_tags?: string[];
  why_fit?: string[];
};

type GenerateResponse = {
  ok: boolean;
  candidates: Candidate[];
};

export default function Home() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 表单状态（按 PRD 设计）
  const [gender, setGender] = useState<"female" | "male" | "neutral">(
    "neutral"
  );
  const [zodiac, setZodiac] = useState("");
  const [mbti, setMbti] = useState("");
  const [vibeKeywords, setVibeKeywords] = useState<string[]>([]);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function toggleVibeKeyword(keyword: string) {
    setVibeKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : prev.length < 3
        ? [...prev, keyword]
        : prev
    );
  }

  // 验证表单是否可以提交
  const canSubmit = gender && zodiac && vibeKeywords.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr(null);
    setLoading(true);

    try {
      const payload = {
        gender,
        zodiac,
        mbti: mbti || undefined,
        vibe_keywords: vibeKeywords,
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error ${res.status}: ${text || "Unknown error"}`);
      }

      const data = (await res.json()) as GenerateResponse;

      sessionStorage.setItem("menei:last_result", JSON.stringify(data));
      sessionStorage.setItem("menei:last_payload", JSON.stringify(payload));

      router.push("/results");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">
            myenglishnameis.com
          </div>

          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            立即开始
          </button>
        </header>

        {/* Hero Section */}
        <section className="mx-auto max-w-5xl py-20">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            告别拼音式英文名，
            <br />
            是时候拥有一个真正适合你的英文名了。
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            一个让你说出口时更自信的英文名。
            <br />
            有文化深度，也更容易被记住与理解。
          </p>

          <div className="mt-10">
            <button
              type="button"
              onClick={scrollToForm}
              className="rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              遇见我的英文名
            </button>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">不是随机生成</h3>
              <p className="mt-2 text-sm text-neutral-600">
                每一个名字，都基于真实的英语文化语境与使用习惯。
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">不是只给结果</h3>
              <p className="mt-2 text-sm text-neutral-600">
                我们解释名字的含义、来源，以及为什么适合你。
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">为长期使用而设计</h3>
              <p className="mt-2 text-sm text-neutral-600">
                这是一个你可以用很多年的英文名。
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">如何运作</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["1. 告诉我们你是谁", "性格、气质、你希望名字传达的感觉"],
              ["2. 生成候选名字", "为你精选 3–5 个最适合的英文名"],
              ["3. 理解为什么适合你", "每个名字都有文化出处与匹配理由"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-neutral-200 p-5"
              >
                <div className="text-sm font-semibold">{title}</div>
                <div className="mt-2 text-sm text-neutral-600">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 表单区：帮用户把"我想成为什么样的人"说清楚 */}
        <section ref={formRef} className="mt-16 scroll-mt-24">
          <div className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">
              先聊聊你自己
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              不需要想太多，选择最接近你的就好。
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-8">
              {/* Step 1: 性别 */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">
                    你希望名字偏向哪种风格？
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    这会影响名字在英语文化中的使用习惯
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "female", label: "偏女性化" },
                    { value: "male", label: "偏男性化" },
                    { value: "neutral", label: "中性 / 都可以" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setGender(option.value as "female" | "male" | "neutral")
                      }
                      className={`rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                        gender === option.value
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: 星座 */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">你的星座是？</h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    帮助我们理解你的性格特质
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {ZODIAC_SIGNS.map((sign) => (
                    <button
                      key={sign.value}
                      type="button"
                      onClick={() => setZodiac(sign.value)}
                      className={`rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                        zodiac === sign.value
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      {sign.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: MBTI（可选） */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">
                    知道自己的 MBTI 吗？
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      可跳过
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    如果你了解自己的 MBTI，可以帮助我们更精准地推荐
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {MBTI_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setMbti(mbti === type ? "" : type)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                        mbti === type
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: 气质关键词（核心） */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium">
                    你希望名字传达什么感觉？
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      选 1-3 个
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    这是最重要的一步——选择你希望别人通过名字感受到的你
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {VIBE_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword.value}
                      type="button"
                      onClick={() => toggleVibeKeyword(keyword.value)}
                      disabled={
                        vibeKeywords.length >= 3 &&
                        !vibeKeywords.includes(keyword.value)
                      }
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        vibeKeywords.includes(keyword.value)
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      } ${
                        vibeKeywords.length >= 3 &&
                        !vibeKeywords.includes(keyword.value)
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                          vibeKeywords.includes(keyword.value)
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300"
                        }`}
                      >
                        {vibeKeywords.includes(keyword.value) && (
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {keyword.label}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-500">
                          {keyword.desc}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {vibeKeywords.length > 0 && (
                  <p className="text-xs text-neutral-500">
                    已选择：
                    {vibeKeywords
                      .map(
                        (k) =>
                          VIBE_KEYWORDS.find((v) => v.value === k)?.label || k
                      )
                      .join("、")}
                  </p>
                )}
              </div>

              {/* 错误提示 */}
              {err && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {err}
                </div>
              )}

              {/* 提交区域 */}
              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading || !canSubmit}
                  className="w-full rounded-2xl bg-neutral-900 px-6 py-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? "正在为你寻找..." : "找到属于我的英文名"}
                </button>

                {!canSubmit && (
                  <p className="text-xs text-neutral-500">
                    请完成上面的选择，帮助我们更好地了解你
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

        <footer className="mt-16 border-t border-neutral-200 pt-8 text-sm text-neutral-500">
          © {new Date().getFullYear()} MyEnglishNameIs
        </footer>
      </div>
    </main>
  );
}
