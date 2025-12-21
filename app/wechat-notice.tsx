"use client";

import { useEffect, useState } from "react";

function isWeChatBrowser() {
  if (typeof navigator === "undefined") return false;
  return /MicroMessenger/i.test(navigator.userAgent);
}

export default function WeChatNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isWeChatBrowser()) return;
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[10000] bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-3 text-center text-white shadow">
      <div className="mx-auto max-w-sm text-sm">
        <div className="font-semibold">💡 获得最佳体验</div>
        <div className="mt-0.5 text-xs/5 opacity-90">
          点击右上角 “...” → “在浏览器中打开”
        </div>
      </div>
    </div>
  );
}
