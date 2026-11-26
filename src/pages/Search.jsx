import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import useDebounce from "../hooks/useDebounce";
import { SkeletonGrid } from "../components/Skeleton";

export default function Search() {
  const [params] = useSearchParams();
  const query = useDebounce((params.get("q") ?? "").trim(), 400);
  const [result, setResult] = useState({ query: "", movies: [], error: "" });

  useEffect(() => {
    if (!query) return;
    let ignore = false;

    tmdb("/search/movie", { query, include_adult: "false" })
      .then((data) => {
        if (!ignore) setResult({ query, movies: data.results, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ query, movies: [], error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [query]);

  const loading = query && result.query !== query;

  let content;
  if (!query) {
    content = <p className="status">Type a movie name in the search box.</p>;
  } else if (loading) {
    content = <SkeletonGrid count={8} />;
  } else if (result.error) {
    content = <p className="status">Something went wrong: {result.error}</p>;
  } else if (result.movies.length === 0) {
    content = <p className="status">No movies found for “{query}”. Try a different title.</p>;
  } else {
    content = (
      <div className="results">
        {result.movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    );
  }

  return (
    <main className="search-page">
      {query && <h1>Results for “{query}”</h1>}
      {content}
    </main>
  );
}