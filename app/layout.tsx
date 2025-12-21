import type { Metadata } from "next";
import "./globals.css";
import WeChatNotice from "./wechat-notice";

export const metadata: Metadata = {
  metadataBase: new URL("https://myenglishnameis.com"),
  title: "MyEnglishNameIs - AI智能英文名推荐专家 | 为你定制完美的英文名",
  description:
    "专业的AI驱动英文名推荐服务，结合文化背景、性格特质和目标国家，为华人量身定制具有深厚文化内涵的英文名。支持MBTI、星座匹配，提供发音指导和文学典故解析。",
  keywords: [
    "英文名推荐",
    "AI英文名",
    "英文名字",
    "取英文名",
    "英文名生成器",
    "英文名字推荐",
    "华人英文名",
    "文化英文名",
    "MBTI英文名",
    "个性化英文名",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://myenglishnameis.com" },
  openGraph: {
    type: "website",
    url: "https://myenglishnameis.com",
    title: "MyEnglishNameIs - AI智能英文名推荐专家",
    description:
      "专业的AI驱动英文名推荐服务，结合文化背景、性格特质和目标国家，为华人量身定制具有深厚文化内涵的英文名。",
    siteName: "MyEnglishNameIs",
    locale: "zh_CN",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MyEnglishNameIs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyEnglishNameIs - AI智能英文名推荐专家",
    description:
      "专业的AI驱动英文名推荐服务，结合文化背景、性格特质和目标国家，为华人量身定制具有深厚文化内涵的英文名。",
    images: ["/og-image.png"],
  },
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <WeChatNotice />
        {children}

        {/* JSON-LD 结构化数据（生产级做法：放在 body 里注入） */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "MyEnglishNameIs",
              alternateName: "AI英文名推荐专家",
              description:
                "专业的AI驱动英文名推荐服务，结合文化背景、性格特质和目标国家，为华人量身定制具有深厚文化内涵的英文名。",
              url: "https://myenglishnameis.com",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Any",
              offers: [
                {
                  "@type": "Offer",
                  name: "免费体验",
                  price: "0",
                  priceCurrency: "CNY",
                  description: "基础英文名推荐服务",
                },
                {
                  "@type": "Offer",
                  name: "专业版",
                  price: "29",
                  priceCurrency: "CNY",
                  description: "完整英文名推荐与详细文化解析",
                },
              ],
              creator: {
                "@type": "Organization",
                name: "MyEnglishNameIs",
                url: "https://myenglishnameis.com",
              },
              inLanguage: ["zh-CN", "en-US"],
              featureList: [
                "AI智能推荐",
                "文化背景分析",
                "MBTI性格匹配",
                "星座特征对应",
                "发音指导",
                "文学典故解析",
                "多国文化适应",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
