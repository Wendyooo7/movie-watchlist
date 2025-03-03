import type { Metadata } from "next";
import SuspenseWrapper from "@/app/shared_components/SuspenseWrapper";
import SearchResult from "./SearchResult";

type SearchParams = Promise<{ query: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { query } = await searchParams;

  return {
    title: `「${query}」的搜尋結果 | 影迷的計畫`,
    description: `在《影迷的計畫》網站上，瀏覽與「${query}」相符的搜尋結果。`,
  };
}

export default function SearchPage() {
  return (
    <SuspenseWrapper>
      <SearchResult />
    </SuspenseWrapper>
  );
}
