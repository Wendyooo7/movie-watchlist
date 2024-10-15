"use client";

import styles from "@/app/styles/watchlistMain.module.scss";
import { useState } from "react";
import { db } from "@/app/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { List } from "./types";

// // TODO:搞懂React.Dispatch<React.SetStateAction<>
// // 定義 List 元件的 props 型別
// interface ListProps {
//   lists: List[]; // 傳遞的 lists 是 List 型別的陣列
//   setLists: React.Dispatch<React.SetStateAction<List[]>>;
// }

// TODO:搞懂用userUid的邏輯
interface AddListModalProps {
  userUid: string | undefined;
  lists: List[];
  setLists: (lists: List[]) => void;
}

export default function AddListModal({
  lists,
  setLists,
  userUid,
}: AddListModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  // 彈出新增片單model
  const handleAddNewList = () => {
    setIsModalVisible(true);
  };

  // 新增片單
  const handleCreateList = async () => {
    if (!userUid) return;

    if (!newListTitle.trim()) {
      handleModalClose();
      return;
    }

    try {
      const newListRef = doc(collection(db, "users", userUid, "lists"));
      await setDoc(newListRef, {
        title: newListTitle,
        movies: [],
        order: lists.length,
      });

      setLists([
        ...lists,
        { id: newListRef.id, title: newListTitle, movies: [] },
      ]);

      setNewListTitle("");
      handleModalClose();
    } catch (error) {
      console.error("Error creating new list: ", error);
    }
  };

  const handleNewListTitleChange = (e: any) => {
    setNewListTitle(e.target.value);
  };

  const handleModalClose = () => {
    setNewListTitle("");
    setIsModalVisible(false);
  };

  return (
    <div className={styles.addNewlistArea}>
      <div className={styles.addNewlistArea__Img} onClick={handleAddNewList}>
        <Image
          src="/watchlist/add_30dp_8440F1.svg"
          width={25}
          height={25}
          alt="新增片單"
        ></Image>
      </div>

      {/* 新增片單名稱用modal */}
      {isModalVisible && (
        <div className={styles.addNewlistArea__modal}>
          <input
            className={styles.addNewListModal__TitleInput}
            value={newListTitle}
            onChange={handleNewListTitleChange}
          ></input>

          <div className={styles.addNewListModal__afterTitleInput}>
            <div
              className={styles.addNewListModal__afterTitleInput__item}
              onClick={handleCreateList}
            >
              <Image
                src="/watchlist/check_30dp_8440F1.svg"
                width={25}
                height={25}
                alt="創建片單"
              ></Image>
            </div>

            <div
              className={styles.addNewListModal__afterTitleInput__item}
              onClick={handleModalClose}
            >
              <Image
                src="/watchlist/close_30dp_8440F1.svg"
                width={25}
                height={25}
                alt="取消創建片單"
              ></Image>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
