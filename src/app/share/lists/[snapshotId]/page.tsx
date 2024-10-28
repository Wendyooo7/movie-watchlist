"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { getDocs, query, orderBy, collection } from "firebase/firestore";
import SnapshotOfLists from "./SnapshotOfLists";
import type { List as ListType } from "@/app/watchlist/types"; // 顯式地指定為型別並重新命名

export default function Page({ params }: { params: { snapshotId: string } }) {
  const { snapshotId } = params; // 從 params 取得 snapshotId
  console.log(snapshotId);
  const [lists, setLists] = useState<ListType[]>([]);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        // 從 snapshot 中獲取 lists 集合
        const listsRef = collection(db, "snapshots", snapshotId, "lists");
        const q = query(listsRef, orderBy("listOrder", "asc"));
        const querySnapshot = await getDocs(q);

        const listsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().listTitle || doc.id,
          movies: doc.data().movies || [],
          order: doc.data().listOrder || 0,
        }));

        setLists(listsData);
        console.log(listsData);
      } catch (error) {
        console.error("Error fetching snapshot: ", error);
      }
    };

    fetchSnapshots();
  }, []);

  return (
    <main>
      <SnapshotOfLists lists={lists} />
    </main>
  );
}
