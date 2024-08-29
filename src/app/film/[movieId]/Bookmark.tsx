"use client";
import styles from "../../styles/movieMain.module.scss";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Bookmark({
  movieId,
  title,
  runtime,
  originalTitle,
}: {
  movieId: string;
  title: string;
  runtime: number;
  originalTitle: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // TODO: 檢查此電影是否已在使用者的片單中，並更新 isBookmarked 狀態
    const checkBookmarkStatus = async () => {
      if (!movieId || !user) return;

      try {
        const userUid = user.uid;
        const docRef = doc(db, "users", userUid, "bookmarks", movieId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      } catch (err) {
        console.error("Error checking bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [movieId, user]);

  // TODO: 將新的收藏3狀態同步至 Firestore
  const toggleBookmark = async () => {
    if (user) {
      const userUid = user.uid;
      const docRef = doc(db, "users", userUid, "bookmarks", movieId);

      let storeMovieDetail;
      if (originalTitle !== title) {
        storeMovieDetail = { movieId, title, originalTitle, runtime };
      } else {
        storeMovieDetail = { movieId, title, runtime };
      }

      try {
        if (!isBookmarked) {
          // 如果該電影尚未收藏，將其詳細資訊存入 Firestore
          await setDoc(docRef, storeMovieDetail);
          setIsBookmarked(true); // 更新本地狀態
          console.log("已將相關資料存進片單");
        } else {
          // 若已經收藏，則刪除該文件
          await deleteDoc(docRef);
          setIsBookmarked(false); // 更新本地狀態
          console.log("已將電影刪除片單");
        }
      } catch (err) {
        console.error("Error updating bookmark status:", err);
      }
    } else {
      console.log("使用者尚未登入");
    }

    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className={styles.bookmark__imgWapper} onClick={toggleBookmark}>
      <Image
        src={
          isBookmarked
            ? "/film/bookmark_solid_2XL_8440F1.svg"
            : "/film/bookmark_reqular_2XL_8440F1.svg"
        }
        width={22}
        height={22}
        alt="加入片單"
      ></Image>
      <div>加入片單</div>
    </div>
  );
}
