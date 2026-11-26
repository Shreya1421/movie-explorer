import { useEffect, useState } from "react";
import { tmdb } from "../api/tmdb";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import { SkeletonHome } from "../components/Skeleton";

const ROWS = [
  { title: "Trending this week", path: "/trending/movie/week" },
  { title: "Popular", path: "/movie/popular" },
  { title: "Top rated", path: "/movie/top_rated" },
  { title: "Upcoming", path: "/movie/upcoming" },
];

export default function Home() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;

    Promise.all(ROWS.map((r) => tmdb(r.path)))
      .then((results) => {
        if (!ignore) {
          setRows(ROWS.map((r, i) => ({ title: r.title, movies: results[i].results })));
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [attempt]);

  function retry() {
    setLoading(true);
    setError("");
    setAttempt((n) => n + 1);
  }

  const featured = rows[0]?.movies.find((m) => m.backdrop_path);

  if (loading) return <SkeletonHome />;

  return (
    <main>
      {error && (
        <div className="status">
          <p>Something went wrong: {error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <Hero movie={featured} />
          <div className="rows">
            {rows.map((r) => (
              <MovieRow key={r.title} title={r.title} movies={r.movies} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}