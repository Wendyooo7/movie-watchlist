import styles from "@/app/styles/watchlistMain.module.scss";
import Link from "next/link";
import { Movie } from "@/app/watchlist/types";
interface MovieItemProps {
  movie: Movie;
  movieIndex: number;
  listId: string;
}

export default function SnapshotOfMovieItem({
  movie,
  movieIndex,
}: MovieItemProps) {
  return (
    <div key={movie.movieId}>
      <div className={styles.movieItem}>
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
      </div>
    </div>
  );
}
