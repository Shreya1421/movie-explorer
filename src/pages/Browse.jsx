import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tmdb } from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import { SkeletonGrid } from "../components/Skeleton";
const SORTS = [
  { value: "popularity.desc", label: "Most popular" },
  { value: "vote_average.desc", label: "Top rated" },
  { value: "primary_release_date.desc", label: "Newest" },
];

function buildParams(genre, sort, page) {
  const p = { sort_by: sort, page: String(page), include_adult: "false" };
  if (genre) p.with_genres = genre;
  if (sort === "vote_average.desc") p["vote_count.gte"] = "300";
  if (sort === "primary_release_date.desc") {
    p["primary_release_date.lte"] = new Date().toISOString().slice(0, 10);
    p["vote_count.gte"] = "10";
  }
  return p;
}

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const genre = params.get("genre") ?? "";
  const sort = params.get("sort") ?? "popularity.desc";
  const key = `${genre}|${sort}`;

  const [genres, setGenres] = useState([]);
  const [result, setResult] = useState({ key: "", movies: [], page: 0, totalPages: 0, error: "" });
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Load the genre list once
  useEffect(() => {
    tmdb("/genre/movie/list")
      .then((data) => setGenres(data.genres))
      .catch(() => {});
  }, []);

  // Load page 1 whenever the genre or sort changes
  useEffect(() => {
    let ignore = false;

    tmdb("/discover/movie", buildParams(genre, sort, 1))
      .then((data) => {
        if (!ignore) {
          setResult({
            key,
            movies: data.results,
            page: 1,
            totalPages: Math.min(data.total_pages, 500),
            error: "",
          });
          setMoreError("");
        }
      })
      .catch((err) => {
        if (!ignore) setResult({ key, movies: [], page: 1, totalPages: 0, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [genre, sort, key, attempt]);

  function update(name, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    setParams(next);
  }

  function retry() {
    setResult((r) => ({ ...r, key: "" }));
    setAttempt((n) => n + 1);
  }

  function loadMore() {
    setLoadingMore(true);
    setMoreError("");
    const next = result.page + 1;

    tmdb("/discover/movie", buildParams(genre, sort, next))
      .then((data) => {
        setResult((r) => {
          if (r.key !== key) return r;
          const fresh = data.results.filter((m) => !r.movies.some((x) => x.id === m.id));
          return { ...r, movies: [...r.movies, ...fresh], page: next };
        });
      })
      .catch((err) => setMoreError(err.message))
      .finally(() => setLoadingMore(false));
  }

  const loading = result.key !== key;
  const hasMore = result.page < result.totalPages;

  let content;
  if (loading) {
     content = <SkeletonGrid />;
  } else if (result.error) {
    content = (
      <div className="status">
        <p>Something went wrong: {result.error}</p>
        <button onClick={retry}>Try again</button>
      </div>
    );
  } else if (result.movies.length === 0) {
    content = <p className="status">No movies match these filters. Try another genre.</p>;
  } else {
    content = (
      <>
        <div className="results">
          {result.movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        {moreError && <p className="status">Could not load more: {moreError}</p>}
        {hasMore && (
          <div className="load-more">
            <button onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <main className="browse">
      <h1>Browse movies</h1>

      <div className="filters">
        <div className="chips" role="group" aria-label="Genre">
          <button
            className={`chip ${genre === "" ? "active" : ""}`}
            aria-pressed={genre === ""}
            onClick={() => update("genre", "")}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              className={`chip ${genre === String(g.id) ? "active" : ""}`}
              aria-pressed={genre === String(g.id)}
              onClick={() => update("genre", String(g.id))}
            >
              {g.name}
            </button>
          ))}
        </div>

        <label className="sort">
          Sort by
          <select value={sort} onChange={(e) => update("sort", e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {content}
    </main>
  );
}