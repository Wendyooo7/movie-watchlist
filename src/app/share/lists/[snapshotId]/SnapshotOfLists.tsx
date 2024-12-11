"use client";

import styles from "@/app/styles/watchlistMain.module.scss";
import SnapshotOfMovieItem from "./SnapshotOfMovieItem";
import type { List } from "@/app/watchlist/types"; // 顯式地指定為型別

// TODO:搞懂React.Dispatch<React.SetStateAction<>
// 定義 List 元件的 props 型別
interface ListProps {
  lists: List[]; // 傳遞的 lists 是 List 型別的陣列
}

export default function SnapshotOfLists({ lists }: ListProps) {
  return (
    <div className={styles.listsContainerContainer}>
      <div className={styles.listsContainer}>
        {lists.map((list) => (
          <div className={styles.listContainer} key={list.id}>
            <div className={styles.listContainer__header}>
              <h2 className={styles.listContainer__header__title__noneditable}>
                {list.title}
              </h2>
            </div>

            <div>
              {list.movies.map((movie, movieIndex) => (
                <SnapshotOfMovieItem
                  key={movie.movieId}
                  movie={movie}
                  listId={list.id}
                  movieIndex={movieIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
