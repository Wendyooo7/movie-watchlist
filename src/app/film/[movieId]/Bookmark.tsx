"use client";
import styles from "../../styles/movieMain.module.scss";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Bookmark({ movieId }: { movieId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // TODO: 檢查此電影是否已在使用者的收藏清單中，並更新 isBookmarked 狀態
  }, [movieId]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);

    // TODO: 將收藏狀態同步至 Firestore
  };

  return (
    <div className={styles.bookmark__imgWapper} onClick={toggleBookmark}>
      <Image
        src={
          isBookmarked
            ? "/film/bookmark_solid_2XL_8440F1.svg"
            : "/film/bookmark_reqular_2XL_8440F1.svg"
        }
        width={25}
        height={25}
        alt="加入片單"
      ></Image>
    </div>
  );
}
