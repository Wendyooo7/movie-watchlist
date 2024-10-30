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

// 定義movie details API返回的電影資料結構
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

// 定義movie videos API返回的電影資料結構
interface Video {
  results: any[];
  key: string;
  site: string;
}

// 定義movie watch providers API返回的電影資料結構
interface OTTlistTW {
  results: {
    // 加上? 讓TW變成可選的
    TW?: {
      link: string;
    };
  };
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

async function getMovieOTTlinkTW(movieId: string): Promise<OTTlistTW> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  const res = await fetch(
    // TODO:有時間試試能否運用Append To Response，和上面其中一個請求合併fetch
    // https://developer.themoviedb.org/docs/append-to-response
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    options
  );

  if (!res.ok) {
    throw new Error("Failed to fetch movie OTT list");
  }

  return res.json();
}

// 動態路由處理和頁面渲染
export default async function MoviePage({
  params,
}: {
  params: { movieId: string };
}) {
  // 處理片介res
  const movie = await getMovieDetail(params.movieId);
  const releaseYear = movie.release_date.split("-")[0];
  const poster = movie.poster_path;
  let posterPath = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
  if (!poster) {
    posterPath = "/film/no-poster-big.png";
  }
  const linkToTMDB = `https://www.themoviedb.org/movie/${movie.id}`;
  const linkToIMDB = `https://www.imdb.com/title/${movie.imdb_id}`;

  // 處理預告片res
  const videos = await getMovieVideos(params.movieId); // 取得影片資料
  const trailer = videos.results.find((result) => result.type === "Trailer");
  const key = trailer ? trailer.key : "";

  // 處理OTT res，只抓取result中的TW的link部分
  const OTTlist = await getMovieOTTlinkTW(params.movieId);
  // const OTTlistresult = OTTlist.results;
  const OTTlistTWlink = OTTlist.results.TW?.link;

  return (
    <main>
      <div className={styles.main__flexContainer}>
        <div className={styles.main__flexItem}>
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
                <div className={styles.movieBio__titleArea__title}>
                  <h2>{movie.title}</h2>
                  {movie.title !== movie.original_title && (
                    <div>{movie.original_title}</div>
                  )}
                </div>

                <div className={styles.movieBio__titleArea__bookmarkArea}>
                  <Bookmark
                    movieId={params.movieId}
                    title={movie.title}
                    runtime={movie.runtime}
                    originalTitle={movie.original_title}
                    releaseYear={releaseYear}
                  />
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
                      src="/film/play_circle_30dp_8440F1.svg"
                      alt="播放預告片"
                      width={22}
                      height={22}
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

              {/* <div className={styles.movieBio__ExternalLinksArea}> */}
              <div className={styles.movieBio__otherMovieDBarea}>
                <label
                  className={styles.movieBio__linkToExternal__label}
                  htmlFor="otherMovieDB"
                >
                  前往電影資料庫：
                </label>
                <Link
                  className={styles.movieBio__linkToExternal__link}
                  href={linkToTMDB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TMDB
                </Link>

                <Link
                  className={styles.movieBio__linkToExternal__link}
                  href={linkToIMDB}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IMDB
                </Link>
              </div>

              {OTTlistTWlink && (
                <div className={styles.movieBio__OTTarea}>
                  <label
                    className={styles.movieBio__linkToExternal__label}
                    htmlFor="OTTlistTW"
                  >
                    查看影音串流平台列表：
                  </label>
                  <Link
                    className={styles.movieBio__linkToExternal__link}
                    href={OTTlistTWlink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JustWatch
                  </Link>
                </div>
              )}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
