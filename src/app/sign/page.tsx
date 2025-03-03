import type { Metadata } from "next";
import SignModal from "./SignModal";

export const metadata: Metadata = {
  title: "登入 / 註冊 | 影迷的計畫",
  description: "以現有帳號登入《影迷的計畫》網站，或註冊新帳號",
};

export default function SignPage() {
  return <SignModal />;
}
