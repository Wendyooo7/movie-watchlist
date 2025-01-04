import type { Metadata } from "next";
import ListPage from "./ListPage";

export const metadata: Metadata = {
  title: "我的片單 | 影迷的計畫",
  description: "在《影迷的計畫》網站上，輕鬆規劃你的觀影清單",
};

export default function Page() {
  return <ListPage />;
}
