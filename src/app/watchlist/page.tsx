"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/app/firebase/config";
import { getDocs, collection, query, orderBy } from "firebase/firestore";
import List from "./List";
import NoList from "./NoList";
import type { List as ListType } from "./types"; // 顯式地指定為型別並重新命名

export default function WatchListPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isListExisting, setIsListExisting] = useState(false);
  const [lists, setLists] = useState<ListType[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/sign");
      return;
    }

    const fetchLists = async () => {
      try {
        const userUid = user.uid;
        const listsRef = collection(db, "users", userUid, "lists");
        const q = query(listsRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);

        const listsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || doc.id,
          movies: doc.data().movies || [],
          order: doc.data().order || 0,
        }));

        setLists(listsData);
        setIsListExisting(listsData.length > 0);
      } catch (error) {
        console.error("Error fetching lists: ", error);
      }
    };

    fetchLists();
  }, [user, router]);

  return (
    <main>
      {isListExisting ? (
        <List
          lists={lists}
          setLists={setLists}
          setIsListExisting={setIsListExisting}
        />
      ) : (
        <NoList />
      )}
    </main>
  );
}
