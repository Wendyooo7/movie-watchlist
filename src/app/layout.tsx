import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/global.scss";
// import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import SuspenseWrapper from "@/app/components/SuspenseWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "影迷的計畫",
  description: "一個提供電影愛好者便利的選片、排片服務的網站",
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
