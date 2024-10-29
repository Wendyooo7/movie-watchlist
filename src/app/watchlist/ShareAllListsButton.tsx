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
      // 讀取所有片單
      const listsRef = collection(db, "users", userUid, "lists");
      const querySnapshot = await getDocs(listsRef);

      if (querySnapshot.empty) {
        throw new Error("沒有找到任何片單資料");
      }

      // 篩選出所有完整的 listData
      const validListData = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return data.title && data.order != null;
      });

      // 如果任何一筆 listData 不完整，則中止生成
      if (validListData.length !== querySnapshot.docs.length) {
        throw new Error("有不完整的 listData，中止生成");
      }

      // 建立 snapshot 文件後，繼續存取
      const snapshotRef = doc(collection(db, "snapshots"));

      // 取得 snapshotRef的id(as snapshotId)
      const snapshotId = snapshotRef.id;
      console.log("快照已保存，ID:", snapshotId);

      // 將快照建立相關資料寫入該snapshot文件
      await setDoc(snapshotRef, {
        createdAt: new Date().toISOString(),
        userUid: userUid, // 可以追蹤是哪個用戶創建的快照
      });

      // 儲存有效的 listData
      const listsCollectionRef = collection(snapshotRef, "lists");

      await Promise.all(
        validListData.map((doc) => {
          const data = doc.data();
          const listData = {
            listTitle: data.title,
            listOrder: data.order,
            movies: Array.isArray(data.movies)
              ? data.movies.map((movie: any) => ({
                  movieId: movie.movieId,
                  title: movie.title,
                  OTTlistTWlink: movie.OTTlistTWlink || null,
                }))
              : [],
          };
          return addDoc(listsCollectionRef, listData);
        })
      );

      // 生成分享連結
      const generatedLink = `https://movie-watchlist-sooty.vercel.app/share/lists/${snapshotId}`;
      setShareLink(generatedLink); // 更新分享連結

      // 自動複製連結到剪貼簿
      await navigator.clipboard.writeText(generatedLink);

      setNotification(null);

      // 顯示成功通知
      setNotification("已成功生成並複製分享連結！");
    } catch (err) {
      setNotification(null);
      setError("Oops! 發生了點問題，請稍後再試。"); // 顯示錯誤訊息
      console.error("生成快照時出錯: ", err);
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
