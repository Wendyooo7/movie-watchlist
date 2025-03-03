"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "@/app/styles/indexMain.module.scss";
import { useInView } from "react-intersection-observer";

export default function IntroArea_2() {
  const { ref: leftRef, inView: leftInView } = useInView({
    triggerOnce: true, // 只觸發一次
    threshold: 0.5, // 元素進入視窗 50% 時觸發
  });

  const { ref: rightRef, inView: rightInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const [activeTab, setActiveTab] = useState("tab-1");

  const tabs = [
    {
      id: "tab-1",
      title: "功能 1：新增片單",
      description: "點擊片單頁的加號圖示，即可新增片單",
      gif: "/index/arrange_1_add-new-list.gif",
    },
    {
      id: "tab-2",
      title: "功能 2：拖曳電影或片單",
      description:
        "點按即可「拖曳」電影或片單，支援「同片單拖曳電影」、「跨片單拖曳電影」和「拖曳片單」3 種模式",
      gif: "/index/arrange_2_drag-movie-and-list.gif",
    },
    {
      id: "tab-3",
      title: "功能 3：刪除電影或片單",
      description:
        "將鼠標移至電影或片單最右方，將顯示刪除圖示或選項（平板和手機為直接顯示），點擊即可刪除該電影或片單",
      gif: "/index/arrange_3_delete-movie-and-list.gif",
    },
    {
      id: "tab-4",
      title: "功能 4：重新命名既有片單",
      description: "點擊片單名稱，即可重新命名既有片單",
      gif: "/index/arrange_4_rename-list.gif",
    },
    {
      id: "tab-5",
      title: "功能 5：重溫電影介紹",
      description: "點擊電影項目，即可重溫電影介紹",
      gif: "/index/arrange_5_link-to-movie-info.gif",
    },
  ];

  const clickedTab = tabs.find((tab) => tab.id === activeTab);
  // 上行將find()的值先存進變數，避免呼叫3次，以優化效能

  return (
    <div className={styles.flexContainer__introArea__2}>
      {/* 左側：頁籤 */}
      <div
        ref={leftRef}
        className={`${styles.introArea__2__text} ${
          leftInView ? styles.animateUp : ""
        }`}
      >
        <div className={styles.introArea__2__text__slogan}>
          輕鬆規劃你的觀影清單
        </div>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.tab} ${
                tab.id === activeTab ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
        </div>
      </div>

      {/* 右側：介紹和影片區 */}
      <div
        ref={rightRef}
        className={`${styles.introArea__2__video} ${
          rightInView ? styles.animateDown : ""
        }`}
      >
        {clickedTab ? (
          <>
            <div className={styles.tabInfo}>
              <div className={styles.tabInfo__title}>{clickedTab.title}</div>
              <p className={styles.tabInfo__description}>
                {clickedTab.description}
              </p>
            </div>
            <div className={styles.gifWrapper}>
              <Image
                className={styles.demoGIF}
                src={clickedTab.gif}
                width={640}
                height={360}
                alt="排片demo_2"
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
