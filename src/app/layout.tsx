import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/global.scss";
import Header from "./shared_components/Header";
import Footer from "./shared_components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import SuspenseWrapper from "@/app/shared_components/SuspenseWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "影迷的計畫",
  description: "你的選片、排片好夥伴",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="zh-hant">
        <body className={inter.className}>
          <SuspenseWrapper>
            <Header />
          </SuspenseWrapper>
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
