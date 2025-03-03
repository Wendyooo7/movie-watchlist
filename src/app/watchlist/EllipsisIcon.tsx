import styles from "@/app/styles/watchlistMain.module.scss";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ShareOneListButton from "./ShareOneListButton";

interface EllipsisIconProps {
  handleDeleteList: (listId: string) => void;
  listId: string;
  userUid: string;
}

export default function EllipsisIcon({
  userUid,
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
        onClickCapture={toggleMenu} // 用這個屬性而非onClick屬性，因為希望在捕獲階段處理
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
          <ShareOneListButton userUid={userUid} listId={listId} />
        </div>
      )}
    </div>
  );
}
