import "../../styles/global.scss";
import styles from "../../styles/movieMain.module.scss";

// 使用 Server Components 的一個範例
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Bookmark from "./Bookmark";

// // 定義頁面的 metadata（選用）
// export const metadata: Metadata = {
//   title: "電影排片站",
// };

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  tagline: string;
  runtime: number;
  original_title: string;
  imdb_id: string;
}

interface Video {
  results: any[];
  key: string;
  site: string;
}

// 在 Server Components 中執行資料抓取

async function getMovieDetail(movieId: string): Promise<Movie> {
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

async function getMovieVideos(movieId: string): Promise<Video> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
    options
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie videos");
  }

  return res.json();
}

// 動態路由處理和頁面渲染
export default async function MoviePage({
  params,
}: {
  params: { movieId: string };
}) {
  const movie = await getMovieDetail(params.movieId);
  const videos = await getMovieVideos(params.movieId); // 取得影片資料
  const trailer = videos.results.find((result) => result.type === "Trailer");
  const key = trailer ? trailer.key : "";
  const releaseYear = movie.release_date.split("-")[0];
  const poster = movie.poster_path;
  let posterPath = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
  if (!poster) {
    posterPath = "/film/no-poster-big.png";
  }
  const linkToTMDB = `https://www.themoviedb.org/movie/${movie.id}`;
  const linkToIMDB = `https://www.imdb.com/title/${movie.imdb_id}`;

  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <div className={styles.mainTop}>
          <div className={styles.imgWrapper}>
            <Image src={posterPath} alt="電影海報" width={250} height={379} />
          </div>

          {/* <div className={styles.imageContainer}>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt="電影劇照"
          layout="fill"
          objectFit="cover"
        />
      </div> */}
          <div className={styles.movieBio}>
            <div className={styles.movieBio__titleArea}>
              <h2>{movie.title}</h2>
              {movie.title !== movie.original_title && (
                <div>{movie.original_title}</div>
              )}

              <div className={styles.movieBio__titleArea__bookmarkArea}>
                <Bookmark movieId={params.movieId} />
              </div>
            </div>

            <div className={styles.movieBio__detailArea}>
              {releaseYear && <div>{releaseYear}年 </div>}

              <div>{movie.runtime}分鐘 </div>

              {key && (
                <Link
                  className={styles.movieBio__detailArea__trailerArea}
                  href={`https://www.youtube.com/watch?v=${key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/film/play_circle_color.svg"
                    alt="播放預告片"
                    width={16}
                    height={16}
                  />
                  播放預告片
                </Link>
              )}
            </div>

            {/* <Link href={`https://www.youtube.com/watch?v=${key}`}>
              播放預告片
            </Link> */}

            <div className={styles.movieBio__overviewArea}>
              {movie.tagline && (
                <p>
                  <i>
                    <b>{movie.tagline}</b>
                  </i>
                </p>
              )}

              {movie.overview ? (
                <p>{movie.overview}</p>
              ) : (
                <div className={styles.movieBio__overviewArea__noOverview}>
                  無更多資料
                </div>
              )}
            </div>

            <div className={styles.movieBio__otherMovieDBarea}>
              {/* <label htmlFor="">在其他電影資料庫開啟：</label> */}
              <Link href={linkToTMDB} target="_blank" rel="noopener noreferrer">
                TMDB
              </Link>
              <Link href={linkToIMDB} target="_blank" rel="noopener noreferrer">
                IMDB
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
