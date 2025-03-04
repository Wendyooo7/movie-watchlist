import styles from "@/app/styles/watchlistMain.module.scss";
import { Draggable } from "@hello-pangea/dnd";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "./types";

interface MovieItemProps {
  movie: Movie;
  movieIndex: number;
  listId: string;
  handleDeleteMovieItem: (listId: string, movieId: string) => void;
}

export default function MovieItem({
  movie,
  movieIndex,
  listId,
  handleDeleteMovieItem,
}: MovieItemProps) {
  return (
    <Draggable
      key={movie.movieId}
      draggableId={movie.movieId}
      index={movieIndex}
    >
      {(provided, snapshot) => (
        <div
          className={`${styles.movieItem} ${
            snapshot.isDragging ? styles.dragging : ""
          }`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={styles.movieItem__details}>
            <div className={styles.movieItem__details__serialNumber}>
              {movieIndex + 1}
            </div>

            <div className={styles.movieItem__details__title}>
              <Link
                href={movie.movieURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {movie.title}
              </Link>
            </div>
          </div>
          <div
            className={styles.movieItem__delete}
            onClick={() => {
              handleDeleteMovieItem(listId, movie.movieId);
            }}
          >
            <Image
              src="/watchlist/close-30dp-8440F1.svg"
              width={20}
              height={20}
              alt="刪除電影"
            ></Image>
          </div>
        </div>
      )}
    </Draggable>
  );
}
