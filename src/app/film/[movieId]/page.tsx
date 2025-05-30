import type { Metadata } from "next";
import "../../styles/global.scss";
import styles from "../../styles/movieMain.module.scss";
import Image from "next/image";
import Link from "next/link";
import Bookmark from "./Bookmark";

type Params = Promise<{ movieId: string }>;
// 動態生成 Metadata
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { movieId } = await params;
  const movie = await getMovieDetails(movieId);
  if (movie === null) {
    return {
      title: "下架的電影資訊 | 影迷的計畫",
    };
  }

  if (movie === undefined) {
    return {
      title: "無法載入的電影資訊 | 影迷的計畫",
    };
  }

  return {
    title: `${movie.title} | 影迷的計畫`,
    description: movie.overview
      ? movie.overview.substring(0, 154) +
        (movie.overview.length > 154 ? "......" : "")
      : `在《影迷的計畫》網站上，探索更多和${movie.title}有關的電影資訊`,
  };
}

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
async function getMovieDetails(
  movieId: string
): Promise<Movie | null | undefined> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=zh-TW`,
      options
    );

    if (!res.ok) {
      console.error("可請求 Movie Details API 但回傳資料有問題", res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("無法請求 Movie Details API: ", err);
    return undefined;
  }
}

async function getMovieVideos(
  movieId: string
): Promise<Video | null | undefined> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
      options
    );

    if (!res.ok) {
      console.error("可請求 Movie Videos API 但回傳資料有問題", res.status);
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("無法請求 Movie Videos API: ", err);
    return undefined;
  }
}

async function getMovieOTTlinkTW(
  movieId: string
): Promise<OTTlistTW | null | undefined> {
  const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN!;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  try {
    const res = await fetch(
      // 有時間試試能否運用Append To Response，和上面其中一個請求合併fetch
      // https://developer.themoviedb.org/docs/append-to-response
      `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
      options
    );

    if (!res.ok) {
      console.error(
        "可請求 Movie Watch Providers API 但回傳資料有問題",
        res.status
      );
      return null;
    }

    return res.json();
  } catch (err) {
    console.error("無法請求 Movie Watch Providers API: ", err);
    return undefined;
  }
}

// 動態路由處理和頁面渲染
export default async function MoviePage(props: { params: Params }) {
  // 處理片介res
  const params = await props.params;
  const { movieId } = params;
  const movie = await getMovieDetails(movieId);
  if (movie === null) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>電影資訊已下架（•᷄⌓•᷅）</div>
          <div className={styles.removedMovieData}>
            別難過......還有更多好電影等著你去探索！
          </div>
        </div>
      </main>
    );
  }

  if (movie === undefined) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>無法載入電影資訊 Σ(⊙_⊙)</div>
          <div className={styles.removedMovieData}>
            請檢查網路連線，或稍後再試
          </div>
        </div>
      </main>
    );
  }

  const releaseYear = movie.release_date.split("-")[0];
  const poster = movie.poster_path;
  let posterPath = `https://image.tmdb.org/t/p/w780${movie.poster_path}`;
  if (!poster) {
    posterPath = "/film/no-poster-big.png";
  }
  const linkToTMDB = `https://www.themoviedb.org/movie/${movie.id}`;
  const linkToIMDB = `https://www.imdb.com/title/${movie.imdb_id}`;

  // 處理預告片res
  const videos = await getMovieVideos(movieId); // 取得影片資料
  if (videos === null) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>預告片已下架（•᷄⌓•᷅）</div>
          <div className={styles.removedMovieData}>
            別難過......還有更多好電影等著你去探索！
          </div>
        </div>
      </main>
    );
  }

  if (videos === undefined) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>
            無法載入預告片資訊 Σ(⊙_⊙)
          </div>
          <div className={styles.removedMovieData}>
            請檢查網路連線，或稍後再試
          </div>
        </div>
      </main>
    );
  }
  const trailer = videos.results.find((result) => result.type === "Trailer");
  const key = trailer ? trailer.key : "";

  // 處理OTT res，只抓取result中的TW的link部分
  const OTTlist = await getMovieOTTlinkTW(movieId);
  if (OTTlist === null) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>OTT 列表已下架（•᷄⌓•᷅）</div>
          <div className={styles.removedMovieData}>
            別難過......還有更多好電影等著你去探索！
          </div>
        </div>
      </main>
    );
  }

  if (OTTlist === undefined) {
    return (
      <main>
        <div className={styles.removedMovieBlock}>
          <div className={styles.removedMovieData}>
            無法載入 OTT 列表資訊 Σ(⊙_⊙)
          </div>
          <div className={styles.removedMovieData}>
            請檢查網路連線，或稍後再試
          </div>
        </div>
      </main>
    );
  }
  const OTTlistTWlink = OTTlist.results.TW?.link;

  return (
    <main>
      <div className={styles.main__flexContainer}>
        <div className={styles.main__flexItem}>
          <div className={styles.main__innerFlexItem}>
            <div className={styles.innerFlexItem__posterWrapper}>
              <Image src={posterPath} alt="電影海報" width={250} height={379} />
            </div>

            <div className={styles.innerFlexItem__movieBio}>
              <div className={styles.movieBio__titleArea}>
                <div className={styles.movieBio__titleArea__titles}>
                  <h2 className={styles.movieBio__titleArea__title}>
                    {movie.title}
                  </h2>
                  {movie.title !== movie.original_title && (
                    <div className={styles.fontSizeNormal}>
                      {movie.original_title}
                    </div>
                  )}
                </div>

                <div className={styles.movieBio__titleArea__bookmarkArea}>
                  <Bookmark
                    movieId={movieId}
                    title={movie.title}
                    runtime={movie.runtime}
                    originalTitle={movie.original_title}
                    releaseYear={releaseYear}
                  />
                </div>
              </div>

              <div
                className={`${styles.movieBio__detailArea} ${styles.fontSizeNormal}`}
              >
                {releaseYear && <div>{releaseYear}年 </div>}

                <div>{movie.runtime}分鐘 </div>

                {key && (
                  <Link
                    className={styles.movieBio__detailArea__trailerArea}
                    href={`https://www.youtube.com/watch?v=${key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div
                      className={
                        styles.movieBio__detailArea__trailerArea__imgWrapper
                      }
                    >
                      <Image
                        src="/film/play-circle-30dp-8440F1.svg"
                        alt="播放預告片"
                        width={22}
                        height={22}
                      />
                    </div>
                    播放預告片
                  </Link>
                )}
              </div>

              <div className={styles.movieBio__overviewArea}>
                {movie.tagline && (
                  <p className={styles.movieBio__overviewArea__tagline}>
                    <i>{movie.tagline}</i>
                  </p>
                )}

                {movie.overview ? (
                  <p className={styles.movieBio__overviewArea__overview}>
                    {movie.overview}
                  </p>
                ) : (
                  <div className={styles.movieBio__overviewArea__noOverview}>
                    無更多資料
                  </div>
                )}
              </div>

              <div
                className={`${styles.movieBio__otherMovieDBarea} ${styles.fontSizeNormal}`}
              >
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
                <div
                  className={`${styles.movieBio__OTTarea} ${styles.fontSizeNormal}`}
                >
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
            </div>
          </div>
        </div>
      </div>
      {/* 將來可能會放劇照 */}
      {/* <div className={styles.stillsWrapper}>
        <Image
          src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
          alt="電影劇照"
          layout="fill"
          objectFit="cover"
        />
      </div> */}
    </main>
  );
}
