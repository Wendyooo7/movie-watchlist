import styles from "@/app/styles/watchlistMain.module.scss";
import { db } from "@/app/firebase/config";
import { doc, getDoc, collection, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function ShareOneListButton({
  userUid,
  listId,
}: {
  userUid: string;
  listId: string;
}) {
  const [shareLink, setShareLink] = useState<string | null>(null); // 用來保存生成的分享連結
  const [isLoading, setIsLoading] = useState(false); // 用來追蹤是否在載入中
  const [error, setError] = useState<string | null>(null); // 用來保存錯誤訊息
  const [notification, setNotification] = useState<string | null>(null); // 控制通知顯示

  const handleShareOneList = async (listId: string) => {
    setIsLoading(true);
    setNotification("連結生成中");

    try {
      // 1. 獲取特定片單資料
      const listRef = doc(db, "users", userUid, "lists", listId);
      const listSnapshot = await getDoc(listRef);

      if (!listSnapshot.exists()) {
        throw new Error("該片單不存在");
      }

      const data = listSnapshot.data();
      if (!data.title || data.order == null) {
        throw new Error("片單數據不完整，無法生成分享連結");
      }

      // 2. 創建快照文件（獨立的集合 snapshots）
      const snapshotRef = doc(collection(db, "snapshot"));

      const snapshotId = snapshotRef.id;
      console.log("快照已保存，ID:", snapshotId);

      await setDoc(snapshotRef, {
        createdAt: new Date().toISOString(),
        userUid: userUid,
        originalListId: listId, // 可以追蹤來源片單
        listTitle: data.title,
        listOrder: data.order,
        movies: Array.isArray(data.movies)
          ? data.movies.map((movie: any) => ({
              movieId: movie.movieId,
              title: movie.title,
              movieURL: movie.movieURL,
            }))
          : [],
      });

      // 3. 生成分享連結
      const generatedLink = `https://movie-watchlist-sooty.vercel.app/share/list/${snapshotId}`;
      setShareLink(generatedLink);
      // 自動複製連結到剪貼簿
      await navigator.clipboard.writeText(generatedLink);

      setNotification(null);

      setNotification("已成功生成並複製分享連結！");
    } catch (err) {
      setNotification(null);
      setError("Oops! 發生了點問題，請稍後再試。");
      console.error("生成快照時出錯: ", err);
    } finally {
      setIsLoading(false);
    }

    // 設置通知在顯示3秒後自動消失
    setTimeout(() => {
      setNotification(null);
      setError(null);
    }, 3000);
  };

  return (
    <>
      <div
        className={styles.listContainer__header__ellipsisModalItem}
        onClick={() => handleShareOneList(listId)}
      >
        分享片單
      </div>

      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </>
  );
}
