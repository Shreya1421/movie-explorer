import { Link } from "react-router-dom";
import { BACKDROP } from "../api/tmdb";

export default function Hero({ movie }) {
  if (!movie) return null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "";

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${BACKDROP}${movie.backdrop_path})` }}
    >
      <div className="hero-content">
        <h1>{movie.title}</h1>
        <p className="hero-meta">{year} · ⭐ {movie.vote_average.toFixed(1)}</p>
        <p className="hero-overview">{movie.overview}</p>
                <Link to={`/movie/${movie.id}`} className="hero-btn">More info</Link>
      </div>
    </section>
  );
}