"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/indexMain.module.scss";

export default function Main() {
  const [query, setQuery] = useState(""); // 用來追蹤使用者輸入的電影名稱
  const router = useRouter(); // 用來進行路由跳轉

  const handleSearch = () => {
    if (query.trim()) {
      const formattedQuery = encodeURIComponent(query.trim()); // 將使用者輸入的內容進行編碼
      // router.push(`/search/${formattedQuery}`); // 跳轉到 `/search/{movie name}` 路由
      router.push(`/search?query=${formattedQuery}`); // 跳轉到 `/search?query={movie name}` 路由
    }
  };

  return (
    <main className={styles.main}>
      <h1>你想將哪部電影加入片單呢？</h1>
      <div className={styles.searchArea}>
        <input
          type="text"
          className={styles.input}
          value={query} // 綁定 input 的值
          onChange={(e) => setQuery(e.target.value)} // 當輸入變化時更新狀態
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // 當使用者按下 Enter 時觸發搜索
        />
        <div className={styles.imgWrapper} onClick={handleSearch}>
          <Image
            src="/search_30dp_AE81FF.svg"
            width={30}
            height={30}
            alt="點擊以檢索片名"
          />
        </div>
      </div>
    </main>
  );
}
