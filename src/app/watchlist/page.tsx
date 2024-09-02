"use client";
import styles from "@/app/styles/watchlistMain.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, getDocs, collection, query } from "firebase/firestore";
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

  return (
    <main className={styles.main}>
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
