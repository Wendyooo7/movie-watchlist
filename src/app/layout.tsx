import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/global.scss";
// import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "電影排片站",
  description: "提供影展愛好者便利的選片、排片服務",
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
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
