import { useFavorites } from "../context/favorites";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { tmdb, IMG, BACKDROP, PROFILE } from "../api/tmdb";

function formatRuntime(min) {
  if (!min) return "";
  return `${Math.floor(min / 60)}h ${min % 60}m`;
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState({ id: "", movie: null, error: "" });
  const [attempt, setAttempt] = useState(0);
    const { isFavorite, toggleFavorite } = useFavorites();

  // Start each movie at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let ignore = false;

    tmdb(`/movie/${id}`, { append_to_response: "credits,videos" })
      .then((movie) => {
        if (!ignore) setResult({ id, movie, error: "" });
      })
      .catch((err) => {
        if (!ignore) setResult({ id, movie: null, error: err.message });
      });

    return () => {
      ignore = true;
    };
  }, [id, attempt]);
    useEffect(() => {
    if (result.movie) document.title = `${result.movie.title} – Movie Explorer`;
    return () => {
      document.title = "Movie Explorer";
    };
  }, [result.movie]);

  function retry() {
    setResult({ id: "", movie: null, error: "" });
    setAttempt((n) => n + 1);
  }

  if (result.id !== id) {
    return <p className="status">Loading movie…</p>;
  }

  if (result.error) {
    return (
      <div className="status">
        <p>Could not load this movie: {result.error}</p>
        <button onClick={retry}>Try again</button>
        <p>
          <Link to="/" className="plain-link">Back to home</Link>
        </p>
      </div>
    );
  }

  const m = result.movie;
  const year = m.release_date ? m.release_date.slice(0, 4) : "";
  const meta = [year, formatRuntime(m.runtime), m.vote_average ? `⭐ ${m.vote_average.toFixed(1)}` : ""]
    .filter(Boolean)
    .join(" · ");
  const trailer = m.videos?.results.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const cast = m.credits?.cast.slice(0, 12) ?? [];

  return (
    <main className="detail">
      <div
        className="detail-bg"
        style={m.backdrop_path ? { backgroundImage: `url(${BACKDROP}${m.backdrop_path})` } : undefined}
      />

      <div className="detail-inner">
        <button className="back" onClick={() => navigate(-1)}>‹ Back</button>

        <div className="detail-top">
          {m.poster_path ? (
            <img className="detail-poster" src={`${IMG}${m.poster_path}`} alt={`Poster of ${m.title}`} />
          ) : (
            <div className="detail-poster no-poster">No poster</div>
          )}

          <div className="detail-info">
            <h1>{m.title}</h1>
            {m.tagline && <p className="tagline">{m.tagline}</p>}
            <p className="detail-meta">{meta}</p>
            <div className="genre-links">
              {m.genres.map((g) => (
                <Link key={g.id} to={`/browse?genre=${g.id}`} className="chip">
                  {g.name}
                </Link>
              ))}
            </div>
            <p className="overview">{m.overview || "No overview available."}</p>
                        <button
              type="button"
              className="list-btn"
              aria-pressed={isFavorite(m.id)}
              onClick={() => toggleFavorite(m)}
            >
              {isFavorite(m.id) ? "✓ In My List" : "+ Add to My List"}
            </button>
          </div>
        </div>

        {trailer && (
          <section>
            <h2>Trailer</h2>
            <div className="trailer">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                title={`${m.title} trailer`}
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        {cast.length > 0 && (
          <section>
            <h2>Cast</h2>
            <div className="cast">
              {cast.map((c) => (
                <div key={c.id} className="cast-card">
                  {c.profile_path ? (
                    <img src={`${PROFILE}${c.profile_path}`} alt={c.name} loading="lazy" />
                  ) : (
                    <div className="cast-photo">{c.name.charAt(0)}</div>
                  )}
                  <strong>{c.name}</strong>
                  <span>{c.character}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}