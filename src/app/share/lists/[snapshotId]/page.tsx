import type { Metadata } from "next";
import SharedLists from "./SharedLists";

export const metadata: Metadata = {
  title: "分享的片單們 | 影迷的計畫",
  description: "在《影迷的計畫》網站上，瀏覽影友和你分享的片單們",
};

type Params = Promise<{ snapshotId: string }>;

export default async function SharedListsPage(props: { params: Params }) {
  const { snapshotId } = await props.params;

  return <SharedLists snapshotId={snapshotId} />;
}
