"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/searchMain.module.scss";
import MovieResults from "./MovieResults";
import Pagination from "./Pagination";

export default function SearchResult() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const pageParam = searchParams.get("page");
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync currentPage with the URL's page parameter
  useEffect(() => {
    if (pageParam) {
      const pageNum = parseInt(pageParam, 10);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }
  }, [pageParam]);

  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        setIsLoading(true); // 發送請求前將 isLoading 設為 true
        setError(null); // 清除舊錯誤，避免影響新的請求

        try {
          const res = await fetch(
            `/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`
          );
          if (!res.ok) {
            throw new Error(
              `Failed to fetch movie data: ${res.status} ${res.statusText}`
            );
          }

          const data = await res.json();
          setResults(data.results || []);
          setTotalResults(data.total_results || 0);
          setTotalPages(data.total_pages || 0);
        } catch (err) {
          setError((err as Error).message || "An unexpected error occurred");
        } finally {
          setIsLoading(false); // 無論成功或失敗，完成後將 isLoading 設為 false
        }
      };

      fetchData();
    }
  }, [query, currentPage]);

  if (error) {
    return (
      <main>
        <div className={styles.errorMsgBlock}>
          <div className={styles.errorMsgTest}>
            查詢過程發生了一點問題 Σ(⊙_⊙)
          </div>
          <div className={styles.errorMsgTest}>請檢查網路連線，或稍後再試</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className={styles.main__flexContainer}>
        <div className={styles.main__flexItem}>
          {isLoading ? (
            <h3 className={styles.main__flexItem__h3}>搜尋中......</h3>
          ) : (
            <>
              <h3
                className={`${styles.searchResultSummary} ${styles.main__flexItem__h3}`}
              >
                您搜尋了 <span className={styles.keyword}>{query}</span>
                ，相符的結果共有{" "}
                <span className={styles.keyword}>{totalResults}</span> 筆
              </h3>

              <MovieResults results={results} />

              <Pagination
                query={query ?? ""}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
