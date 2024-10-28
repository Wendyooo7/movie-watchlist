import styles from "@/app/styles/watchlistMain.module.scss";
import { db } from "@/app/firebase/config";
import { addDoc, doc, getDocs, collection, setDoc } from "firebase/firestore";
import { useState } from "react";

export default function ShareAllListsButton({ userUid }: { userUid: string }) {
  const [shareLink, setShareLink] = useState<string | null>(null); // 用來保存生成的分享連結
  const [isLoading, setIsLoading] = useState(false); // 用來追蹤是否在載入中
  const [error, setError] = useState<string | null>(null); // 用來保存錯誤訊息
  const [notification, setNotification] = useState<string | null>(null); // 控制通知顯示

  const handleShareAllLists = async () => {
    setIsLoading(true); // 開始載入
    setNotification("連結生成中"); // 顯示"連結生成中"通知

    try {
      // 從 Firestore 獲取當前用戶的全部片單
      const listsRef = collection(db, "users", userUid, "lists");
      const querySnapshot = await getDocs(listsRef);

      if (!querySnapshot.empty) {
        // 在 snapshots 集合中新建一個 snapshot 文件
        const snapshotRef = doc(collection(db, "snapshots"));

        // 取得 snapshotId，這個 snapshot 文件會成為片單的父文件
        const snapshotId = snapshotRef.id;
        console.log("快照已保存，ID:", snapshotId);

        // 將快照資料寫入 Firestore 的 snapshots 集合
        await setDoc(snapshotRef, {
          createdAt: new Date().toISOString(),
          userUid: userUid, // 可以追蹤是哪個用戶創建的快照
        });

        // 逐個保存每個 list 作為 snapshots/snapshotId/lists 集合中的文檔
        const listsCollectionRef = collection(snapshotRef, "lists");

        await Promise.all(
          querySnapshot.docs.map((doc) => {
            const data = doc.data();

            // 準備要保存的每個 list 的資料
            const listData = {
              listTitle: data.title,
              listOrder: data.order,
              movies: Array.isArray(data.movies)
                ? data.movies.map((movie: any) => {
                    const movieData: any = {
                      movieId: movie.movieId,
                      title: movie.title,
                    };
                    if (movie.OTTlistTWlink) {
                      movieData.OTTlistTWlink = movie.OTTlistTWlink;
                    }
                    return movieData;
                  })
                : [], // 如果 movies 不是陣列，回傳空陣列
            };

            // 將每個 list 存儲為一個文檔
            return addDoc(listsCollectionRef, listData);
          })
        );

        // 生成分享連結
        const generatedLink = `https://movie-watchlist-sooty.vercel.app/share/lists/${snapshotId}`;
        setShareLink(generatedLink); // 更新分享連結

        // 自動複製連結到剪貼簿
        await navigator.clipboard.writeText(generatedLink);

        setNotification(null);

        // 顯示“已複製分享連結”的通知
        setNotification("已成功生成並複製分享連結！");
      } else {
        throw new Error("沒有找到任何片單資料");
      }
    } catch (err) {
      setNotification(null);
      console.error("生成快照時出錯: ", err);
      setError("Oops! 發生了點問題，請稍後再試。"); // 顯示錯誤訊息
      setNotification("Oops! 發生了點問題，請稍後再試。");
    } finally {
      setIsLoading(false); // 停止載入狀態
    }

    // 設置通知在顯示3秒後自動消失
    setTimeout(() => {
      setNotification(null);
      setError(null);
    }, 3000);
  };

  return (
    <div className={styles.shareAllListsBtnContainer}>
      <div className={styles.shareAllListsBtn} onClick={handleShareAllLists}>
        分享全部片單
      </div>

      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
