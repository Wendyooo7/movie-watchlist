import "../../styles/global.scss";
import styles from "../../styles/movieMain.module.scss";

// 使用 Server Components 的一個範例
import { Metadata } from "next";
import Image from "next/image";

// 定義頁面的 metadata（選用）
export const metadata: Metadata = {
  title: "Movie Details",
};

interface Movie {
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  tagline: string;
  runtime: number;
  original_title: string;
}

// 在 Server Components 中執行資料抓取
async function getMovie(movieId: string): Promise<Movie> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=zh-TW`,
    options
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie data");
  }

  return res.json();
}

// 動態路由處理和頁面渲染
export default async function MoviePage({
  params,
}: {
  params: { movieId: string };
}) {
  const movie = await getMovie(params.movieId);
  const releaseYear = movie.release_date.split("-")[0];

  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <div className={styles.mainTop}>
          <div className={styles.imgWrapper}>
            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt="電影海報"
              width={250}
              height={379}
            />
          </div>

          {/* <div className={styles.imageContainer}>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt="電影劇照"
          layout="fill"
          objectFit="cover"
        />
      </div> */}
          <div className={styles.movieDescription}>
            <h2>{movie.title}</h2>
            <p>
              <i>{movie.tagline}</i>
            </p>
            <p>{movie.overview}</p>
          </div>
        </div>
        <div>{releaseYear} 年</div>
        <div>{movie.runtime} 分鐘</div>
        {!(movie.title === movie.original_title) ? (
          <div>{movie.original_title}</div>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}
