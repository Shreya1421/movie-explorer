import { Link } from "react-router-dom";
import { IMG } from "../api/tmdb";
import HeartButton from "./HeartButton";

export default function MovieCard({ movie }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "N/A";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "–";

  return (
    <article className="card">
      <Link to={`/movie/${movie.id}`} className="card-link">
        {movie.poster_path ? (
          <img
            className="poster"
            src={`${IMG}${movie.poster_path}`}
            alt={`Poster of ${movie.title}`}
            loading="lazy"
          />
        ) : (
          <div className="poster no-poster">No poster</div>
        )}
        <div className="card-info">
          <h3>{movie.title}</h3>
          <p>{year} · ⭐ {rating}</p>
        </div>
      </Link>
      <HeartButton movie={movie} />
    </article>
  );
}