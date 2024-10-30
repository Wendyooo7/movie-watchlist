export interface List {
  id: string;
  title: string;
  movies: Movie[];
}

export interface Movie {
  movieId: string;
  title: string;
  movieURL: string;
}
