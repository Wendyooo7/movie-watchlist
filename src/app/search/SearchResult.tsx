"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/searchMain.module.scss";

export default function SearchResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
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

        try {
          const res = await fetch(
            `/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`
          );
          if (!res.ok) {
            throw new Error(`Failed to fetch movie data: ${res.statusText}`);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/search?query=${query}&page=${page}`);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    const maxButtons = 10; // 每次顯示的頁數按鈕數量
    const startPageGroup =
      Math.floor((currentPage - 1) / maxButtons) * maxButtons + 1;
    const endPageGroup = Math.min(startPageGroup + maxButtons - 1, totalPages);

    // 第一頁按鈕
    if (startPageGroup > 1) {
      pageButtons.push(
        <button key="first" onClick={() => handlePageChange(1)}>
          <Image
            src="/search/first-page-icon.svg"
            width={20}
            height={20}
            alt="回到第一頁"
          />
        </button>
      );
    }

    // 上一頁按鈕
    if (currentPage > 1) {
      pageButtons.push(
        <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>
          <Image
            src="/search/chevron-left-icon.svg"
            width={20}
            height={20}
            alt="回到上一頁"
          />
        </button>
      );
    }

    // 中間的頁數按鈕
    for (let page = startPageGroup; page <= endPageGroup; page++) {
      pageButtons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      );
    }

    // 下一頁按鈕
    if (currentPage < totalPages) {
      pageButtons.push(
        <button key="next" onClick={() => handlePageChange(currentPage + 1)}>
          <Image
            src="/search/chevron-right-icon.svg"
            width={20}
            height={20}
            alt="前往下一頁"
          />
        </button>
      );
    }

    // 最後一頁按鈕
    if (endPageGroup < totalPages) {
      pageButtons.push(
        <button key="last" onClick={() => handlePageChange(totalPages)}>
          <Image
            src="/search/last-page-icon.svg"
            width={20}
            height={20}
            alt="回到第一頁"
          />
        </button>
      );
    }

    return pageButtons;
  };

  if (error) {
    return <p>Error: {error}</p>;
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

              <div className={styles.eachMovieArea}>
                {results.map((movie) => {
                  const releaseYear = movie.release_date.split("-")[0];
                  const poster = movie.poster_path;
                  let posterPath = `https://image.tmdb.org/t/p/w154${poster}`;
                  if (!poster) {
                    posterPath = "/search/no-poster.png";
                  }

                  return (
                    <Link href={`/film/${movie.id}`} key={movie.id}>
                      <div className={styles.eachMovieDiv}>
                        <div>
                          <Image
                            src={posterPath}
                            width={92}
                            height={138}
                            alt="海報"
                          />
                        </div>
                        <div className={styles.eachMovieDetailDiv}>
                          <h3
                            className={`${styles.eachMovieDetailDiv__title} ${styles.main__flexItem__h3}`}
                          >
                            {movie.title}
                          </h3>
                          <h3 className={styles.main__flexItem__h3}>
                            {releaseYear}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className={styles.pageButtonsArea}>
                {/* 只有在 totalPages > 1 時才顯示頁數導航按鈕 */}
                {totalPages > 1 && (
                  <div className={styles.pageButtons}>
                    {renderPageButtons()}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
