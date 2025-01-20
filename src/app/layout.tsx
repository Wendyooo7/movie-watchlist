import type { Metadata } from "next";
import { Noto_Sans_TC, Inter, Zen_Old_Mincho } from "next/font/google";
import "./styles/global.scss";
import Header from "./shared_components/Header";
import Footer from "./shared_components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import SuspenseWrapper from "@/app/shared_components/SuspenseWrapper";

// const inter = Inter({ subsets: ["latin"] });

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"], // 支援英文
});

const zenOldMincho = Zen_Old_Mincho({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "影迷的計畫",
  description: "你的選片、排片好夥伴",
  icons: {
    icon: "/favicon.ico", // 指向 public 資料夾的 favicon 路徑
  },
  keywords: [
    "電影",
    "movie",
    "觀影清單",
    "片單",
    "watchlist",
    "favorite movies",
    "movie collection",
    "影展",
    "film festival",
    "選片",
    "排片",
    "影迷",
    "cinephile",
    "影癡",
    "moviegoer",
    "filmgoer",
  ],
  openGraph: {
    url: "https://cinephileslists.vercel.app/",
    images: [
      {
        url: "https://cinephileslists.vercel.app/open-graph-img.png",
        width: 300,
        height: 157,
        // 寬高應該要1200*630，但logo製作網站最大只提供上面尺寸
        alt: "logo",
      },
    ],
  },
  twitter: {
    // 小型卡片，僅包含標題、描述和縮圖
    card: "summary",
    images: ["https://cinephileslists.vercel.app/open-graph-img.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="zh-hant">
        <body className={notoSansTC.className}>
          <SuspenseWrapper>
            <Header fontClass={zenOldMincho.className} />
          </SuspenseWrapper>
          {children}
          <Footer fontClass={zenOldMincho.className} />
        </body>
      </html>
    </AuthProvider>
  );
}
