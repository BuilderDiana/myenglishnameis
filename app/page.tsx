"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 星座列表
const ZODIAC_SIGNS = [
  { value: "aries", label: "🐏 白羊座 (Aries)" },
  { value: "taurus", label: "🐂 金牛座 (Taurus)" },
  { value: "gemini", label: "👯 双子座 (Gemini)" },
  { value: "cancer", label: "🦀 巨蟹座 (Cancer)" },
  { value: "leo", label: "🦁 狮子座 (Leo)" },
  { value: "virgo", label: "💃 处女座 (Virgo)" },
  { value: "libra", label: "⚖️ 天秤座 (Libra)" },
  { value: "scorpio", label: "🦂 天蝎座 (Scorpio)" },
  { value: "sagittarius", label: "🏹 射手座 (Sagittarius)" },
  { value: "capricorn", label: "🐐 摩羯座 (Capricorn)" },
  { value: "aquarius", label: "🏺 水瓶座 (Aquarius)" },
  { value: "pisces", label: "🐟 双鱼座 (Pisces)" },
];

// MBTI 类型
const MBTI_TYPES = [
  "🏛️ INTJ", "🧪 INTP", "♟️ ENTJ", "💡 ENTP",
  "🔮 INFJ", "🌿 INFP", "📢 ENFJ", "🌈 ENFP",
  "📜 ISTJ", "🛡️ ISFJ", "📋 ESTJ", "🤝 ESFJ",
  "🛠️ ISTP", "🎨 ISFP", "⚡️ ESTP", "🎭 ESFP",
];

// 气质关键词选项
const VIBE_KEYWORDS = [
  { value: "rational", label: "理性智识：冷静、逻辑清晰" },
  { value: "gentle", label: "温润如玉：亲切、平和" },
  { value: "independent", label: "独立自由：自主、有主见" },
  { value: "warm", label: "温暖亲和：好相处、让人放松" },
  { value: "elegant", label: "优雅高贵：有品味、从容" },
  { value: "confident", label: "从容自信：坚定、有气场" },
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

export default function LandingPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement | null>(null);

  const CHINESE_ZODIAC_SIGNS = [
    { value: "rat", label: "🐭 鼠 (Rat)" },
    { value: "ox", label: "🐮 牛 (Ox)" },
    { value: "tiger", label: "🐯 虎 (Tiger)" },
    { value: "rabbit", label: "🐰 兔 (Rabbit)" },
    { value: "dragon", label: "🐲 龙 (Dragon)" },
    { value: "snake", label: "🐍 蛇 (Snake)" },
    { value: "horse", label: "🐴 马 (Horse)" },
    { value: "goat", label: "🐐 羊 (Goat)" },
    { value: "monkey", label: "🐵 猴 (Monkey)" },
    { value: "rooster", label: "🐔 鸡 (Rooster)" },
    { value: "dog", label: "🐶 狗 (Dog)" },
    { value: "pig", label: "🐷 猪 (Pig)" },
  ];

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // 表单状态（按 PRD 设计）
  const [chineseName, setChineseName] = useState("");
  const [gender, setGender] = useState<"female" | "male" | "neutral">(
    "neutral"
  );
  const [zodiac, setZodiac] = useState("");
  const [chineseZodiac, setChineseZodiac] = useState("");
  const [mbti, setMbti] = useState("");
  const [vibeKeywords, setVibeKeywords] = useState<string[]>([]);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const toggleVibe = (val: string) => {
    if (vibeKeywords.includes(val)) {
      setVibeKeywords(vibeKeywords.filter((v) => v !== val));
    } else {
      if (vibeKeywords.length < 2) {
        setVibeKeywords([...vibeKeywords, val]);
      } else {
        // If already 2, replace the last one (Jobsian Focus with a bit more freedom)
        setVibeKeywords([vibeKeywords[0], val]);
      }
    }
  };

  // 验证表单是否可以提交
  const canSubmit = gender && zodiac && chineseZodiac && vibeKeywords.length > 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr(null);
    setLoading(true);
    setProgress(0);

    // 模拟进度与状态文案
    const messages = [
      "正在深度解析你的星象与生肖特质...",
      "正在世界文学与影视宝库中搜寻灵感...",
      "正在精选 3 个最契合你的名字...",
      "即将为你呈现...",
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 95) {
        currentProgress = 95;
        clearInterval(interval);
      }
      setProgress(currentProgress);

      // 根据进度切换文案
      if (currentProgress < 30) setStatusMessage(messages[0]);
      else if (currentProgress < 60) setStatusMessage(messages[1]);
      else if (currentProgress < 90) setStatusMessage(messages[2]);
      else setStatusMessage(messages[3]);
    }, 400);

    try {
      const payload = {
        chinese_name: chineseName || undefined,
        gender,
        zodiac,
        chinese_zodiac: chineseZodiac,
        mbti: mbti ? mbti.split(" ")[1] : undefined,
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

      // 成功后直接拉满进度
      setProgress(100);
      clearInterval(interval);

      sessionStorage.setItem("menei:last_result", JSON.stringify(data));
      sessionStorage.setItem("menei:last_payload", JSON.stringify(payload));

      // 稍微延迟一下让用户看到 100%
      setTimeout(() => {
        router.push("/results");
      }, 500);
    } catch (e: unknown) {
      clearInterval(interval);
      setErr(e instanceof Error ? e.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-500">
          <div className="w-full max-w-xs px-6">
            {/* Status Text */}
            <div className="mt-8 text-center">
              <p className="text-sm font-medium text-neutral-900 animate-pulse">
                {statusMessage}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
                AI Naming Consultant is working
              </p>
            </div>
            {/* Progress Bar Container */}
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full bg-neutral-900 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-tight">
            MyEnglishNameIs
          </div>
          <nav className="hidden space-x-8 text-sm font-medium text-neutral-500 sm:flex">
            <a href="#how" className="hover:text-neutral-900">
              遇见之旅
            </a>
            <a href="#why" className="hover:text-neutral-900">
              为什么是我们
            </a>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="mx-auto max-w-5xl py-20">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            一个契合的英文名，
            <br />
            是你的第二张名片。
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            不要随便把拼音敷衍地当成英文名。
            <br />
            在国际社交中，一个地道的英文名能让你告别“外来者”的疏离感，遇见那个更自信的自己。
          </p>

          <div className="mt-10">
            <button
              type="button"
              onClick={scrollToForm}
              className="rounded-2xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              寻找我的专属之名
            </button>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold">拒绝平庸拼音</h3>
              <p className="mt-2 text-sm text-neutral-600">
                拼音不是英文名。我们为你寻找真正符合英语文化逻辑的名字。
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">告别社交尴尬</h3>
              <p className="mt-2 text-sm text-neutral-600">
                让你的名字在对方口中自然流淌，建立第一时间的文化共鸣。
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold">承载个人故事</h3>
              <p className="mt-2 text-sm text-neutral-600">
                每一个推荐的名字，都源于你的性格特质，具有永恒的陪伴意义。
              </p>
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why" className="mt-24 rounded-3xl bg-neutral-50 p-8 sm:p-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              为什么不直接问 ChatGPT？
            </h2>
            <p className="mt-4 text-base leading-7 text-neutral-600">
              通用的 AI 往往只能给出随机、大众化或缺乏文化连接的名字列表。
              <br />
              而我们构建了一个<strong>多维人格合成引擎</strong>。
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold">深度人格合成</h4>
                <p className="mt-2 text-sm text-neutral-500">
                  综合分析你的西方星座、中国生肖与 MBTI，确保名字与你的内在特质产生深层共鸣。
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">世界级文化底蕴</h4>
                <p className="mt-2 text-sm text-neutral-500">
                  每一个名字都经过文学、影视与经典文献的考证，拒绝廉价感。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Prelude */}
        <section id="how" className="mt-32 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            名字的诞生，是一场精准的契合。
          </h2>
          <div className="mt-6 space-y-2 text-base text-neutral-500">
            <p>深度解析你的星象、生肖与性格底色</p>
            <p>在世界文学与经典宝库中搜寻灵感</p>
            <p>唤醒那个将陪伴你一生的专属之名</p>
          </div>
        </section>

        {/* 表单区 */}
        <section ref={formRef} className="mt-16 scroll-mt-24 pb-32">
          <div className="rounded-3xl border border-neutral-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">
              让我们开启一场关于『你想成为谁』的对话。
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              随后，我们将为你唤醒那个最契合的名字。
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              {/* Step 0: 中文名 (可选) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900">
                  你的中文名
                  <span className="ml-2 text-xs font-normal text-neutral-400">
                    (可选)
                  </span>
                </label>
                <input
                  type="text"
                  value={chineseName}
                  onChange={(e) => setChineseName(e.target.value)}
                  placeholder="输入中文名，寻找音韵或意境的呼应"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Step 1: 性别风格 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">
                    你偏好的性别风格？
                  </label>
                  <select
                    value={gender}
                    onChange={(e) =>
                      setGender(e.target.value as "female" | "male" | "neutral")
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="neutral">中性化 / 现代 (Neutral)</option>
                    <option value="female">女性化 / 优雅 (Feminine)</option>
                    <option value="male">男性化 / 阳刚 (Masculine)</option>
                  </select>
                </div>

                {/* Step 2: 西方星座 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">
                    你的西方星座？
                  </label>
                  <select
                    value={zodiac}
                    onChange={(e) => setZodiac(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="">请选择你的星座</option>
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign.value} value={sign.value}>
                        {sign.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: 中国生肖 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">
                    你的中国生肖？
                  </label>
                  <select
                    value={chineseZodiac}
                    onChange={(e) => setChineseZodiac(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="">请选择你的生肖</option>
                    {CHINESE_ZODIAC_SIGNS.map((sign) => (
                      <option key={sign.value} value={sign.value}>
                        {sign.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4: MBTI（可选） */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-900">
                    你的 MBTI 类型？
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      (可选)
                    </span>
                  </label>
                  <select
                    value={mbti}
                    onChange={(e) => setMbti(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  >
                    <option value="">请选择 MBTI (可选)</option>
                    {MBTI_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 5: 气质关键词（核心） */}
              <div className="space-y-3 pt-2">
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">
                    你希望名字传达哪种核心特质？
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      (最多选 2 个)
                    </span>
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    这是最关键的一步——选择你希望世界如何感知你
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {VIBE_KEYWORDS.map((keyword) => (
                    <button
                      key={keyword.value}
                      type="button"
                      onClick={() => toggleVibe(keyword.value)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        vibeKeywords.includes(keyword.value)
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-300"
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
                      <div className="text-sm font-medium">
                        {keyword.label}
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
                          VIBE_KEYWORDS.find((v) => v.value === k)?.label.split("：")[0] || k
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
                  {loading ? "正在为你唤醒名字..." : "寻找我的专属之名"}
                </button>

                {!canSubmit && (
                  <p className="text-xs text-neutral-500">
                    请完成上面的选择，开启你的名字之旅
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
