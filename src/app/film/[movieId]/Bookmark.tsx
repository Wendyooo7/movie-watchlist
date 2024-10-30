"use client";
import styles from "../../styles/movieMain.module.scss";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from "@/app/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";

// 定義 Bookmark 元件的屬性
interface BookmarkProps {
  movieId: string;
  title: string;
  runtime: number;
  originalTitle: string;
  releaseYear: string;
}

export default function Bookmark({
  movieId,
  title,
  runtime,
  originalTitle,
  releaseYear,
}: BookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // TODO: 檢查此電影是否已在使用者的片單中，並更新 isBookmarked 狀態
    const checkBookmarkStatus = async () => {
      if (!movieId || !user) return;

      try {
        const userUid = user.uid;
        const listsCollectionRef = collection(db, "users", userUid, "lists");
        const listsSnapshot = await getDocs(listsCollectionRef);

        let found = false;

        listsSnapshot.forEach((listDoc) => {
          const movies = listDoc.data().movies || [];
          if (movies.some((movie: any) => movie.movieId === movieId)) {
            found = true;
          }
        });

        setIsBookmarked(found);
      } catch (err) {
        console.error("Error checking bookmark status:", err);
      }
    };

    checkBookmarkStatus();
  }, [movieId, user]);

  // TODO: 將新的收藏狀態同步至 Firestore
  const toggleBookmark = async () => {
    if (!user) {
      console.log("使用者尚未登入");
      return;
    }

    try {
      const userUid = user.uid;
      const defaultListRef = doc(db, "users", userUid, "lists", "預設片單");

      // 檢查 default 文件是否存在
      const defaultListDoc = await getDoc(defaultListRef);

      if (!defaultListDoc.exists()) {
        // 如果 default 文件不存在，創建該文件
        await setDoc(defaultListRef, {
          movies: [],
          order: 0,
          title: "預設片單",
        });
      }

      const movieURL = `https://movie-watchlist-sooty.vercel.app/film/${movieId}`;

      // 檢查 每個電影資訊 是否存在，只將存在的電影資訊加到 storeMovieDetail
      const storeMovieDetail = {
        movieId,
        title,
        movieURL,
        ...(releaseYear && { releaseYear }),
        ...(originalTitle && { originalTitle }),
        ...(runtime && { runtime }),
      };

      if (!isBookmarked) {
        // 如果該電影尚未收藏，將其詳細資訊加入預設片單的 movies 陣列

        await updateDoc(defaultListRef, {
          movies: arrayUnion(storeMovieDetail),
        });
        setIsBookmarked(true);
        console.log("將電影存入預設片單");
      } else {
        // 若已經收藏，則從所有包含該電影的片單的 movies 陣列中移除該電影
        const listsCollectionRef = collection(db, "users", userUid, "lists");
        const listsSnapshot = await getDocs(listsCollectionRef);

        listsSnapshot.forEach(async (listDoc) => {
          const movies = listDoc.data().movies || [];
          if (movies.some((movie: any) => movie.movieId === movieId)) {
            await updateDoc(listDoc.ref, {
              movies: arrayRemove(storeMovieDetail),
            });
          }
        });
        setIsBookmarked(false);
        console.log("將電影從所有片單中移除");
      }
    } catch (err) {
      console.error("Error updating bookmark status:", err);
    }

    setIsBookmarked(!isBookmarked);
  };

  return (
    <div
      className={`${styles.bookmark__imgWapper} ${
        !user ? styles.disabled : ""
      }`}
      onClick={toggleBookmark}
    >
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
      <div>{isBookmarked ? "已加入片單" : "加入片單"}</div>

      {!user && <div className={styles.tooltip}>登入即可加入片單</div>}
    </div>
  );
}
