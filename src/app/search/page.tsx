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

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<any[]>([]); // 保存 API 返回的電影數據
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        try {
          const res = await fetch(
            `/api/search?query=${encodeURIComponent(query)}`
          );
          if (!res.ok) {
            throw new Error(`Failed to fetch movie data: ${res.statusText}`);
          }
          const data = await res.json();
          setResults(data.results || []);
        } catch (err) {
          // 使用類型斷言來處理 unknown 類型的錯誤
          setError((err as Error).message || "An unexpected error occurred");
        }
      };

      fetchData();
    }
  }, [query]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
      <h1>Search Results for: {query}</h1>
      <ul>
        {results.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </main>
  );
}
