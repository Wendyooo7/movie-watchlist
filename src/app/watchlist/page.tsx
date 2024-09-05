"use client";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/watchlistMain.module.scss";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  doc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Image from "next/image";
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
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/sign");
    }

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

  // 彈出新增片單model
  const handleAddNewList = () => {
    setIsModalVisible(true);
  };

  const handleCreateList = async () => {
    if (!user) return;

    if (!newListTitle.trim()) {
      handleModalClose();
      return;
    }

    try {
      const userUid = user.uid;
      const newListRef = doc(collection(db, "users", userUid, "lists"));
      await setDoc(newListRef, {
        title: newListTitle,
        movies: [],
      });

      setLists([
        ...lists,
        { id: newListRef.id, title: newListTitle, movies: [] },
      ]);

      setNewListTitle("");
      handleModalClose();
    } catch (error) {
      console.error("Error creating new list: ", error);
    }
  };

  const handleNewListTitleChange = (e: any) => {
    setNewListTitle(e.target.value);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <main>
      <div className={styles.listsContainerContainer}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className={styles.listsContainer}>
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
                            <div className={styles.movieItem__serialNumber}>
                              {index + 1}
                            </div>
                            <div className={styles.movieItem__title}>
                              {movie.title}
                            </div>
                            {movie.OTTlistTWlink && (
                              <Link
                                className={styles.movieItem__OTTlink}
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

            <div className={styles.addNewlistArea}>
              <div
                className={styles.addNewlistArea__Img}
                onClick={handleAddNewList}
              >
                <Image
                  src="/watchlist/add_30dp_8440F1.svg"
                  width={25}
                  height={25}
                  alt="新增片單"
                ></Image>
              </div>

              {/* 新增片單名稱用modal */}
              {isModalVisible && (
                <div className={styles.addNewlistArea__modal}>
                  <input
                    className={styles.addNewListModal__TitleInput}
                    value={newListTitle}
                    onChange={handleNewListTitleChange}
                  ></input>

                  <div className={styles.addNewListModal__afterTitleInput}>
                    <div
                      className={styles.addNewListModal__afterTitleInput__item}
                      onClick={handleCreateList}
                    >
                      <Image
                        src="/watchlist/check_30dp_8440F1.svg"
                        width={25}
                        height={25}
                        alt="創建片單"
                      ></Image>
                    </div>

                    <div
                      className={styles.addNewListModal__afterTitleInput__item}
                      onClick={handleModalClose}
                    >
                      <Image
                        src="/watchlist/close_30dp_8440F1.svg"
                        width={25}
                        height={25}
                        alt="取消創建片單"
                      ></Image>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DragDropContext>
      </div>
    </main>
  );
}
