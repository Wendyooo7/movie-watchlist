"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, getDocs, collection, query } from "firebase/firestore";
import { db } from "@/app/firebase/config"; // 假設你的Firebase設定在firebase.ts中

interface List {
  id: string;
  title: string;
  movies: Movie[];
}

interface Movie {
  title: string;
  OTTlistTWlink?: string;
}

export default function MyLists() {
  const [lists, setLists] = useState<List[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchLists = async () => {
      try {
        const userUid = user.uid;
        const listsRef = collection(db, "users", userUid, "lists");
        const q = query(listsRef);
        const querySnapshot = await getDocs(q);

        const listsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || doc.id,
          movies: doc.data().movies || [],
        }));

        setLists(listsData);
      } catch (error) {
        console.error("Error fetching lists: ", error);
      }
    };

    fetchLists();
  }, [user]);

  return (
    <main>
      <div>
        {lists.map((list) => (
          <div key={list.id}>
            <h2>{list.title}</h2>
            {list.movies.map((movie, index) => (
              <div key={index}>{movie.title}</div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
