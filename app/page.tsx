"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 表单状态（先做“够用且专业”的字段，后续可扩展：MBTI/星座/国家等）
  const [chineseName, setChineseName] = useState("");
  const [pinyin, setPinyin] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "neutral">(
    "neutral"
  );
  const [scene, setScene] = useState<"work" | "study" | "social">("social");
  const [rare, setRare] = useState(70); // 0-100
  const [cute, setCute] = useState(70); // 0-100

  const vibe = useMemo(() => {
    const tags: string[] = [];
    if (rare >= 60) tags.push("rare");
    if (cute >= 60) tags.push("cute");
    if (!tags.length) tags.push("balanced");
    return tags;
  }, [rare, cute]);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const payload = {
        chinese_name: chineseName.trim(),
        pinyin: pinyin.trim(),
        gender,
        scene,
        weights: { rare, cute },
        vibe,
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

      // 生产级：临时用 sessionStorage 传结果（下一步我们会换成 DB + /results/[id]）
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
            Start now
          </button>
        </header>

        <section className="mt-14">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Get a rare, adorable English name
            <span className="text-neutral-500"> that fits you.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            为中文母语者生成更贴合气质与场景的英文名，并给出文化出处、发音、昵称与“为什么适合你”的解释。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Start generating
            </button>

            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
            >
              How it works
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["Rare but usable", "小众但不怪，日常和职场都能用"],
              ["Cute & friendly", "更亲和、更有记忆点"],
              ["Cultural notes", "出处、含义、昵称、发音一次讲清"],
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

        <section id="how" className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              ["1) Tell us your vibe", "可爱/罕见/中性/正式等偏好 + 使用场景"],
              ["2) Generate candidates", "生成 5–10 个候选名 + 昵称 + 发音"],
              [
                "3) Explain why it fits",
                "给出文化出处与匹配理由，可分享/可保存",
              ],
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

        {/* 表单区：Landing 底部直接引导填写 */}
        <section ref={formRef} className="mt-16 scroll-mt-24">
          <div className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">
              Tell us about you
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              填完直接出结果（下一页）。我们先做“罕见独特 /
              可爱亲和”最核心体验。
            </p>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm font-medium">中文名（可选）</span>
                  <input
                    value={chineseName}
                    onChange={(e) => setChineseName(e.target.value)}
                    className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                    placeholder="例如：丹丹 / 大为"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium">拼音（可选）</span>
                  <input
                    value={pinyin}
                    onChange={(e) => setPinyin(e.target.value)}
                    className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                    placeholder="例如：dan deng"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm font-medium">性别倾向</span>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as "female" | "male" | "neutral")
                    }
                    className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option value="neutral">中性</option>
                    <option value="female">偏女性</option>
                    <option value="male">偏男性</option>
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium">使用场景</span>
                  <select
                    value={scene}
                    onChange={(e) =>
                      setScene(e.target.value as "work" | "study" | "social")
                    }
                    className="h-11 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
                  >
                    <option value="social">社交/日常</option>
                    <option value="work">职场/商务</option>
                    <option value="study">留学/校园</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">罕见独特</span>
                    <span className="text-xs text-neutral-500">{rare}/100</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={rare}
                    onChange={(e) => setRare(Number(e.target.value))}
                  />
                </label>

                <label className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">可爱亲和</span>
                    <span className="text-xs text-neutral-500">{cute}/100</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={cute}
                    onChange={(e) => setCute(Number(e.target.value))}
                  />
                </label>
              </div>

              {err && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {err}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate my name"}
                </button>

                <div className="text-xs text-neutral-500">
                  当前偏好：{vibe.join(", ")} · {scene} · {gender}
                </div>
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
