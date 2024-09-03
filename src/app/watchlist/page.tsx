"use client";
import styles from "@/app/styles/watchlistMain.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, getDocs, updateDoc, collection, query } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Link from "next/link";

interface List {
  id: string;
  title: string;
  movies: Movie[];
}

interface Movie {
  movieId: string;
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

  // 拖曳後將新的順序存入Firestore
  const handleOnDragEnd = async (result: DropResult) => {
    if (!user) return;
    const userUid = user.uid;

    const { destination, source } = result;

    if (!destination) return;

    // 只允許在相同的 droppableId 內拖曳
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceListIndex = lists.findIndex(
      (list) => list.id === source.droppableId
    );
    const destListIndex = lists.findIndex(
      (list) => list.id === destination.droppableId
    );

    if (sourceListIndex === -1 || destListIndex === -1) return;

    const sourceList = lists[sourceListIndex];
    const destList = lists[destListIndex];
    const [movedMovie] = sourceList.movies.splice(source.index, 1);

    destList.movies.splice(destination.index, 0, movedMovie);

    const updatedLists = Array.from(lists);
    updatedLists[sourceListIndex] = { ...sourceList };
    updatedLists[destListIndex] = { ...destList };

    setLists(updatedLists);

    // 將更新後的順序存回 Firestore
    try {
      const sourceListRef = doc(db, "users", userUid, "lists", sourceList.id);
      const destListRef = doc(db, "users", userUid, "lists", destList.id);

      await updateDoc(sourceListRef, { movies: sourceList.movies });
      await updateDoc(destListRef, { movies: destList.movies });
    } catch (error) {
      console.error("Error updating lists: ", error);
    }
  };

  return (
    <main>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div>
          {lists.map((list) => (
            <Droppable key={list.id} droppableId={list.id}>
              {(provided) => (
                <div
                  className={styles.listContainer}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <h2 className={styles.listTitle}>{list.title}</h2>

                  {list.movies.map((movie, index) => (
                    <Draggable
                      key={movie.movieId}
                      draggableId={movie.movieId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.movieItem} ${
                            snapshot.isDragging ? styles.dragging : ""
                          }`}
                        >
                          {movie.title}
                          {movie.OTTlistTWlink && (
                            <Link
                              href={movie.OTTlistTWlink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              OTT
                            </Link>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </main>
  );
}
