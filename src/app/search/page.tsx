import type { Metadata } from "next";
import SuspenseWrapper from "@/app/shared_components/SuspenseWrapper";
import SearchResult from "./SearchResult";

type SearchParams = Promise<{ query: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { query } = await searchParams;

  return {
    title: `「${query}」的搜尋結果 | 影迷的計畫`,
    description: `在《影迷的計畫》網站上，瀏覽與「${query}」相符的搜尋結果。`,
  };
}

export default function SearchPage() {
  return (
    <SuspenseWrapper>
      <SearchResult />
    </SuspenseWrapper>
  );
}

// export default function Page({ params }: { params: { movieName: string } }) {
//   return <div>My Post: {params.movieName}</div>;
// }

// interface SearchPageProps {
//   params: { movieName: string };
// }

// export default function SearchPage({ params }: SearchPageProps) {
//   const { movieName } = params;

//   return (
//     <div>
//       <h1>Search Results for: {decodeURIComponent(movieName)}</h1>
//       {/* 在這裡根據 movieName 進行搜索並展示結果 */}
//     </div>
//   );
// }

// "use client";
// import { useRouter } from "next/router";

// export default function SearchPage() {
//   const router = useRouter();
//   const { movieName } = router.query;

//   // 確保 movieName 被正確解碼並顯示
//   const decodedMovieName = movieName
//     ? decodeURIComponent(movieName as string)
//     : "";

//   return (
//     <div>
//       <h1>Search Results for: {decodedMovieName}</h1>
//       {/* 在這裡根據 decodedMovieName 進行搜索並展示結果 */}
//     </div>
//   );
// }

// // 動態路由
// "use client";
// import { useParams } from "next/navigation";

// export default function SearchPage() {
//   const params = useParams();
//   const movieName = params.movieName;

//   // 確保 movieName 是字符串類型，並進行解碼
//   const decodedMovieName = Array.isArray(movieName)
//     ? decodeURIComponent(movieName[0])
//     : decodeURIComponent(movieName || "");

//   return (
//     <main>
//       <h1>Search Results for: {decodedMovieName}</h1>
//       {/* 在這裡根據 decodedMovieName 進行搜索並展示結果 */}
//     </main>
//   );
// }

// "use client";
// import { useSearchParams } from "next/navigation";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");

//   return (
//     <div>
//       <h1>Search Results for: {query}</h1>
//       {/* 根據 query 進行搜索並展示結果 */}
//     </div>
//   );
// }

// /app/search/page.tsx

// import { GetServerSideProps } from "next";

// interface SearchPageProps {
//   query: string;
//   movies: any[]; // 根據API回應調整型別
// }

// export default function SearchPage({ query, movies }: SearchPageProps) {
//   return (
//     <div>
//       <h1>Search Results for: {query}</h1>
//       <ul>
//         {movies.map((movie) => (
//           <li key={movie.id}>{movie.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const query = context.query.query as string;
//   const response = await fetch(
//     `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
//       query
//     )}&include_adult=false&language=en-US&page=1`,
//     {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         Authorization: "Bearer your_access_token_here",
//       },
//     }
//   );

//   const data = await response.json();
//   const movies = data.results || [];

//   return { props: { query, movies } };
// };

// // app/search/page.tsx
// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");
//   const [results, setResults] = useState<any[]>([]); // 保存 API 返回的電影數據
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (query) {
//       const fetchData = async () => {
//         try {
//           const res = await fetch(
//             `/api/search?query=${encodeURIComponent(query)}`
//           );
//           if (!res.ok) {
//             throw new Error("Failed to fetch movie data");
//           }
//           const data = await res.json();
//           setResults(data.results);
//         } catch (err) {
//           setError(err.message);
//         }
//       };

//       fetchData();
//     }
//   }, [query]);

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div>
//       <h1>Search Results for: {query}</h1>
//       <ul>
//         {results.map((movie) => (
//           <li key={movie.id}>{movie.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");
//   const [results, setResults] = useState<any[]>([]); // 保存 API 返回的電影數據
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (query) {
//       const fetchData = async () => {
//         try {
//           const res = await fetch(
//             `/api/search?query=${encodeURIComponent(query)}`
//           );
//           if (!res.ok) {
//             throw new Error(`Failed to fetch movie data: ${res.statusText}`);
//           }
//           const data = await res.json();
//           setResults(data.results || []);
//         } catch (err) {
//           // 使用類型斷言來處理 unknown 類型的錯誤
//           setError((err as Error).message || "An unexpected error occurred");
//         }
//       };

//       fetchData();
//     }
//   }, [query]);

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <main>
//       <h1>Search Results for: {query}</h1>
//       <ul>
//         {results.map((movie) => (
//           <li key={movie.id}>{movie.title}</li>
//         ))}
//       </ul>
//     </main>
//   );
// }

// ______________________________________________________
// "use client";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import styles from "../styles/searchMain.module.scss";

// export default function SearchPage() {
//   const searchParams = useSearchParams();
//   const query = searchParams.get("query");
//   const [results, setResults] = useState<any[]>([]);
//   const [totalResults, setTotalResults] = useState<number>(0); // 總結果數
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(0); // 總頁數
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (query) {
//       const fetchData = async () => {
//         try {
//           const res = await fetch(
//             `/api/search?query=${encodeURIComponent(query)}&page=${currentPage}`
//           );
//           if (!res.ok) {
//             throw new Error(`Failed to fetch movie data: ${res.statusText}`);
//           }
//           const data = await res.json();
//           setResults(data.results || []);
//           setTotalResults(data.total_results || 0); // 設定總結果數
//           setTotalPages(data.total_pages || 0); // 設定總頁數
//         } catch (err) {
//           setError((err as Error).message || "An unexpected error occurred");
//         }
//       };

//       fetchData();
//     }
//   }, [query, currentPage]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   return (
//     <div className={styles.mainWrapper}>
//       <main className={styles.main}>
//         <h2>
//           您搜尋了 {query} ，相符的結果共有 {totalResults} 筆
//         </h2>

//         {results.map((movie) => {
//           const releaseYear = movie.release_date.split("-")[0];
//           const poster = movie.poster_path;
//           let posterPath = `https://image.tmdb.org/t/p/w92${poster}`;
//           if (!poster) {
//             posterPath = "/no-poster.png";
//           }

//           return (
//             <div key={movie.id} className={styles.eachMovieDiv}>
//               <div>
//                 <Image src={posterPath} width={92} height={138} alt="海報" />
//               </div>
//               <div className={styles.eachMovieDetailDiv}>
//                 <h2>{movie.title}</h2>
//                 <h3>{releaseYear}</h3>
//               </div>
//             </div>
//           );
//         })}

//         <div>
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index + 1}
//               onClick={() => handlePageChange(index + 1)}
//               disabled={index + 1 === currentPage}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
