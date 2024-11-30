import styles from "@/app/styles/watchlistMain.module.scss";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface EllipsisIconProps {
  handleDeleteList: (listId: string) => void;
  listId: string;
}

export default function EllipsisIcon({
  listId,
  handleDeleteList,
}: EllipsisIconProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsModalVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 判斷點擊是否在 modal 或 ellipsis icon 內部
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        iconRef.current &&
        !iconRef.current.contains(event.target as Node)
      ) {
        setIsModalVisible(false);
      }
      console.log(modalRef.current);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.listContainer__header__ellipsis__root}>
      <div
        ref={iconRef} // 新增 ref 給 ellipsis icon
        className={`${styles.listContainer__header__ellipsisIcon} ${
          isModalVisible ? styles.visible : ""
        }`}
        // onClick={toggleMenu}
        onClickCapture={toggleMenu} // 捕獲階段處理
      >
        <Image
          src="/watchlist/ellipsis_8440F1.svg"
          width={18}
          height={18}
          alt="展開片單選項"
        ></Image>
      </div>

      {isModalVisible && (
        <div
          ref={modalRef}
          className={styles.listContainer__header__ellipsisModal}
        >
          <div
            className={styles.listContainer__header__ellipsisModalItem}
            onClick={() => {
              handleDeleteList(listId);
            }}
          >
            刪除片單
          </div>
          <div className={styles.listContainer__header__ellipsisModalItem}>
            分享片單
          </div>
        </div>
      )}
    </div>
  );
}
