import styles from "../styles/searchMain.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function MovieResults({ results }: { results: any[] }) {
  return (
    <div className={styles.eachMovieArea}>
      {results.map((movie) => {
        const releaseYear = movie.release_date.split("-")[0];
        const poster = movie.poster_path;
        let posterPath = `https://image.tmdb.org/t/p/w154${poster}`;
        if (!poster) {
          posterPath = "/search/no-poster.png";
        }

        return (
          <Link href={`/film/${movie.id}`} key={movie.id}>
            <div className={styles.eachMovieDiv}>
              <div>
                <Image src={posterPath} width={92} height={138} alt="海報" />
              </div>
              <div className={styles.eachMovieDetailDiv}>
                <h3
                  className={`${styles.eachMovieDetailDiv__title} ${styles.main__flexItem__h3}`}
                >
                  {movie.title}
                </h3>
                <h3 className={styles.main__flexItem__h3}>{releaseYear}</h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
