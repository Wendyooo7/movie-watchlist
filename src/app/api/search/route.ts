// import { NextResponse } from "next/server";

// const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN; // 從環境變數中獲取 TMDB API Key

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get("query");

//   if (!query) {
//     return NextResponse.json(
//       { error: "Query parameter is required" },
//       { status: 400 }
//     );
//   }

//   const options = {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       Authorization: `Bearer ${API_ACCESS_TOKEN}`,
//     },
//   };

//   try {
//     const response = await fetch(
//       `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
//         query
//       )}&include_adult=false&language=en-US&page=1`,
//       options
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       return NextResponse.json(
//         { error: `Failed to fetch movie data: ${errorData.message}` },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (err) {
//     return NextResponse.json(
//       { error: "An error occurred while fetching data" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

const API_ACCESS_TOKEN = process.env.TMDB_API_ACCESS_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = searchParams.get("page") || "1"; // 預設為第 1 頁

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_ACCESS_TOKEN}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&include_adult=false&language=zh-TW&page=${page}`,
      options
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Failed to fetch movie data: ${errorData.message}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while fetching data" },
      { status: 500 }
    );
  }
}
