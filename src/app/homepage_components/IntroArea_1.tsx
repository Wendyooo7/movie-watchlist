"use client";

import styles from "@/app/styles/indexMain.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function IntroArea_1() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 直接對目標操作，避免選取錯誤
            entry.target.classList.add(styles.visible);
          }
          // 若要重複觸發動畫
          // else {
          //   entry.target.classList.remove(styles.visible); // 當元素離開視窗時移除類名
          // }
        });
      },
      { threshold: 0.5 } // 目標進入視窗的 50% 以上即觸發
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.flexContainer__introArea__1}>
      <div className={styles.introArea__1__video}>
        <div className={styles.gifWrapper}>
          <Image
            className={styles.demoGIF}
            src="/index/pick.gif"
            width={640}
            height={360}
            alt="選片demo"
          />
        </div>
      </div>
      <div
        ref={containerRef}
        className={`${styles.introArea__1__text} ${styles.hidden}`}
      >
        <div className={styles.introArea__1__text__slogan}>
          盡情探索感興趣的電影
        </div>
        <div className={styles.introArea__1__text__detail}>
          Step 1 : 搜尋並選擇感興趣的電影
          <br />
          Step 2 : 瀏覽電影介紹
          <br />
          Step 3 : 喜歡的話，就加入片單！
        </div>
      </div>
    </div>
  );
}
