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
  received?: unknown;
  candidates: Candidate[];
};

export default function GeneratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Dan",
          vibe: ["rare", "cute"],
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status}. ${text}`);
      }

      const data = (await res.json()) as GenerateResponse;
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Generate</h1>
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          ← Back
        </Link>
      </div>

      <p className="mt-2 text-sm text-neutral-600">
        现在是生产级路由与跳转：内部导航用 Link；CTA 语义明确；结果可稳定渲染。
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <div className="text-xs text-neutral-500">
          Demo input: name=Dan, vibe=[rare, cute]
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result?.ok && (
        <div className="mt-6 grid gap-3">
          {result.candidates.map((c) => (
            <div key={c.name} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <div className="text-lg font-semibold">{c.name}</div>
                {c.pronunciation_ipa && (
                  <div className="text-sm text-neutral-600">/{c.pronunciation_ipa}/</div>
                )}
              </div>

              {c.origin && <div className="mt-2 text-sm text-neutral-600">Origin: {c.origin}</div>}

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
