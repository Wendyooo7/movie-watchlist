"use client";

import styles from "@/app/styles/watchlistMain.module.scss";
import { db } from "@/app/firebase/config";
import { useAuth } from "@/app/contexts/AuthContext";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ShareAllListsButton from "./ShareAllListsButton";
import EditableListTitle from "./EditableListTitle";
import AddListModal from "./AddListModal";
import MovieItem from "./MovieItem";
import EllipsisIcon from "./EllipsisIcon";
import type { List } from "./types"; // 顯式地指定為型別

// 定義 List 元件的 props 型別
interface ListProps {
  lists: List[]; // 傳遞的 lists 是 List 型別的陣列
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  setIsListExisting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function List({
  lists,
  setLists,
  setIsListExisting,
}: ListProps) {
  const { user } = useAuth();

  const handleOnDragEnd = async (result: DropResult) => {
    if (!user) return;
    const userUid = user.uid;
    const { destination, source, type } = result;

    // 檢查有無目的地
    if (!destination) {
      return;
    }

    // 如果目的地與來源一樣，不做動作
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // 針對片單類型的拖曳進行處理
    if (type === "LIST") {
      const newListsOrder = Array.from(lists);
      const [movedList] = newListsOrder.splice(source.index, 1);
      newListsOrder.splice(destination.index, 0, movedList);

      // 因為下面更新Firestore 片單順序比較久，若先更新FS會渲染兩次，看起來會很詭異，所以才先更新本地狀態
      // 不然通常是要先更新資料庫再更新本地，避免操作不成功仍更新本地狀態，造成兩邊不同步
      setLists(newListsOrder);

      // 更新 Firestore 片單順序
      try {
        for (let i = 0; i < newListsOrder.length; i++) {
          const listRef = doc(
            db,
            "users",
            user.uid,
            "lists",
            newListsOrder[i].id
          );
          await updateDoc(listRef, { order: i });
        }
      } catch (error) {
        console.error("Error updating list order: ", error);
      }

      return;
    }

    // 找出來源與目的地片單的索引
    const sourceListIndex = lists.findIndex(
      (list) => list.id === source.droppableId
    );

    const destListIndex = lists.findIndex(
      (list) => list.id === destination.droppableId
    );

    if (sourceListIndex === -1 || destListIndex === -1) return;

    const sourceList = lists[sourceListIndex];
    const destList = lists[destListIndex];

    // 從來源片單中移除電影項目
    const [movedMovie] = sourceList.movies.splice(source.index, 1);

    // 將電影項目插入到目標片單
    destList.movies.splice(destination.index, 0, movedMovie);

    // 建立更新後的片單副本
    const updatedLists = Array.from(lists);
    // 更新來源片單與目標片單
    updatedLists[sourceListIndex] = { ...sourceList };
    updatedLists[destListIndex] = { ...destList };

    // 儲存變更到 Firestore
    try {
      const sourceListRef = doc(db, "users", userUid, "lists", sourceList.id);
      const destListRef = doc(db, "users", userUid, "lists", destList.id);

      // 非同步更新 Firestore，確保更新了兩個片單的 movies 陣列
      await updateDoc(sourceListRef, { movies: sourceList.movies });
      await updateDoc(destListRef, { movies: destList.movies });

      // 更新狀態
      setLists(updatedLists);
    } catch (error) {
      console.error("Error updating lists: ", error);
    }
  };

  // 刪除片單
  const handleDeleteList = async (listId: string) => {
    if (!user) return;

    try {
      const userUid = user.uid;
      const listRef = doc(db, "users", userUid, "lists", listId);

      // 移除該片單，並更新本地state
      const updatedLists = lists.filter((list) => {
        return list.id !== listId;
      });

      // 從 Firestore 中刪除該片單
      await deleteDoc(listRef);

      setLists(updatedLists);
      setIsListExisting(updatedLists.length > 0);
    } catch (err) {
      console.error("Error deleting list: ", err);
    }
  };

  // 刪除電影項目
  const handleDeleteMovieItem = async (listId: string, movieId: string) => {
    if (!user) return;

    try {
      const userUid = user.uid;
      const listRef = doc(db, "users", userUid, "lists", listId);

      // 找到對應片單並移除電影，並更新本地狀態
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            movies: list.movies.filter((movie) => movie.movieId !== movieId),
          };
        }
        return list;
      });

      // 更新 Firestore 中的片單
      const updatedMovies = updatedLists.find(
        (list) => list.id === listId
      )?.movies;
      await updateDoc(listRef, { movies: updatedMovies });

      setLists(updatedLists);
    } catch (err) {
      console.error("Error deleting movie item: ", err);
    }
  };

  return (
    <div className={styles.listsContainerContainer}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="all-lists" type="LIST" direction="horizontal">
          {(provided) => (
            <div
              className={styles.listsContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {lists.map((list, listIndex) => (
                <Draggable
                  key={list.id}
                  draggableId={list.id}
                  index={listIndex}
                >
                  {(provided) => (
                    <div
                      className={styles.listContainer}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <div className={styles.listContainer__header}>
                        {user && (
                          <EditableListTitle
                            listId={list.id}
                            userUid={user.uid}
                            initialTitle={list.title}
                            onUpdateSuccess={() =>
                              console.log("Title updated successfully")
                            }
                            onUpdateError={(error) =>
                              console.error("Update failed:", error)
                            }
                          />
                        )}

                        {user && (
                          <EllipsisIcon
                            userUid={user.uid}
                            handleDeleteList={handleDeleteList}
                            listId={list.id}
                          />
                        )}
                      </div>

                      <Droppable droppableId={list.id} type="MOVIE">
                        {(provided, snapshot) => (
                          <div
                            className={styles.MovieItemDroppable}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {list.movies.map((movie, movieIndex) => (
                              <MovieItem
                                key={movie.movieId}
                                movie={movie}
                                movieIndex={movieIndex}
                                listId={list.id}
                                handleDeleteMovieItem={handleDeleteMovieItem}
                              />
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {user && (
                <AddListModal
                  lists={lists}
                  setLists={setLists}
                  userUid={user.uid}
                />
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {user && <ShareAllListsButton userUid={user.uid} />}
    </div>
  );
}
