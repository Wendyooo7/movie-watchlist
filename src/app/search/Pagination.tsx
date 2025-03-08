import styles from "../styles/searchMain.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface PaginationProps {
  query: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export default function Pagination({
  query,
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.replace(`/search?query=${query}&page=${page}`);
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

  return (
    <div className={styles.pageButtonsArea}>
      {/* 只有在 totalPages > 1 時才顯示頁數導航按鈕 */}
      {totalPages > 1 && (
        <div className={styles.pageButtons}>{renderPageButtons()}</div>
      )}
    </div>
  );
}
