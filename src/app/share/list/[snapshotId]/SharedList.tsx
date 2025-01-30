"use client";

import styles from "@/app/styles/searchMain.module.scss";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import SnapshotOfList from "./SnapshotOfList";
import type { List as ListType } from "@/app/watchlist/types"; // 顯式地指定為型別並重新命名

export default function SharedList({ snapshotId }: { snapshotId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<ListType | null>(null);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        // 從 Firestore 中取得單一文件的資料
        const listRef = doc(db, "snapshot", snapshotId);
        const listSnapshot = await getDoc(listRef);

        if (listSnapshot.exists()) {
          const listData = {
            id: listSnapshot.id,
            title: listSnapshot.data()?.listTitle || listSnapshot.id,
            movies: listSnapshot.data()?.movies || [],
            order: listSnapshot.data()?.listOrder || 0,
          };
          setList(listData); // 設定單一片單的資料
          console.log(listData);
        } else {
          console.error("該 snapshot 不存在");
        }
      } catch (error) {
        console.error("Error fetching snapshot: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnapshots();
  }, [snapshotId]);

  return (
    <main>
      {isLoading ? (
        <div className={styles.main__flexContainer}>
          <div className={styles.main__flexItem}>
            <h3 className={styles.main__flexItem__h3}>資料讀取中......</h3>
          </div>
        </div>
      ) : (
        list && <SnapshotOfList list={list} />
      )}
    </main>
  );
}
