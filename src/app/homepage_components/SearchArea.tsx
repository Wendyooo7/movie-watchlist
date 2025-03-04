"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/indexMain.module.scss";

export default function SearchArea() {
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const [query, setQuery] = useState(""); // 用來追蹤使用者輸入的電影名稱
  const router = useRouter(); // 用來進行路由跳轉
  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimationDone(true); // 動畫結束後切換狀態
    }, 7000); // 確保與 CSS 動畫時間同步

    return () => clearTimeout(timer); // 清除計時器避免內存洩漏
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      const formattedQuery = encodeURIComponent(query.trim()); // 將使用者輸入的內容進行編碼
      router.push(`/search?query=${formattedQuery}`); // 跳轉到 `/search?query={movie name}` 路由
    }
  };

  return (
    <div className={styles.flexContainer__searchArea}>
      <h1
        className={`${styles.searchArea__slogan} ${
          isAnimationDone
            ? styles.typing_animation_done
            : styles.typing_animation
        }`}
      >
        你想將哪部電影加入片單呢？
      </h1>
      <div className={styles.searchArea__input}>
        <input
          type="text"
          className={styles.input}
          value={query} // 綁定 input 的值
          onChange={(e) => setQuery(e.target.value)} // 當輸入變化時更新狀態
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 當使用者按下 Enter 時觸發搜索
          placeholder={placeholder}
          onMouseEnter={() => setPlaceholder("請輸入原片名、譯名或關鍵字")}
          onMouseLeave={() => setPlaceholder("")}
        />
        <div className={styles.imgWrapper} onClick={handleSearch}>
          <Image
            src="/index/search-30dp-AE81FF.svg"
            width={30}
            height={30}
            alt="點擊以檢索片名"
          />
        </div>
      </div>
    </div>
  );
}
