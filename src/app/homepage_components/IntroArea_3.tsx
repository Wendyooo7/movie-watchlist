"use client";

import styles from "@/app/styles/indexMain.module.scss";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function IntroArea_3() {
  const containerRefVideo = useRef(null);
  const containerRefText = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        },
        { threshold: 1 }
      );
    });

    if (containerRefVideo.current) observer.observe(containerRefVideo.current);
    if (containerRefText.current) observer.observe(containerRefText.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.flexContainer__introArea__3}>
      <div
        ref={containerRefVideo}
        className={`${styles.introArea__3__video} ${styles.hidden}`}
      >
        <div className={styles.gifWrapper}>
          <Image
            className={styles.demoGIF}
            src="/index/share.gif"
            width={640}
            height={360}
            alt="分享片單demo"
          />
        </div>
      </div>
      <div
        ref={containerRefText}
        className={`${styles.introArea__3__text} ${styles.hidden}`}
      >
        <div className={styles.introArea__3__text__slogan}>
          把排好的片單分享出去吧！
        </div>
        <div className={styles.introArea__3__text__detail}>
          <div
            className={`${styles.introArea__3__text__detail__item} ${styles.marginBottom}`}
          >
            <div className={styles.iconWrapper}>
              <Image
                src="/index/heart-plus-30dp-FFFFFF.svg"
                width={30}
                height={30}
                alt="bullet point"
              />
              &nbsp;
            </div>
            <div>可選擇分享特定或全部片單</div>
          </div>
          <div className={styles.introArea__3__text__detail__item}>
            <div className={styles.iconWrapper}>
              <Image
                src="/index/heart-plus-30dp-FFFFFF.svg"
                width={30}
                height={30}
                alt="bullet point"
              />
              &nbsp;
            </div>
            <div>無論是想長久收藏當下的片單快照，</div>
          </div>
          <div>　&nbsp;&nbsp;或是和影友一起討論你的選片難題，</div>
          <div>　&nbsp;&nbsp;又或和朋友們分享你的年度十大愛片，</div>
          <div>　&nbsp;&nbsp;通通都可以一鍵實現！</div>
        </div>
      </div>
    </div>
  );
}
