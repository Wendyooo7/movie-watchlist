import type { Metadata } from "next";
import SharedList from "./SharedList";

export const metadata: Metadata = {
  title: "分享的片單 | 影迷的計畫",
  description: "在《影迷的計畫》網站上，瀏覽影友和你分享的片單",
};

type Params = Promise<{ snapshotId: string }>;

export default async function SharedListPage({ params }: { params: Params }) {
  const { snapshotId } = await params;
  return <SharedList snapshotId={snapshotId} />;
}
