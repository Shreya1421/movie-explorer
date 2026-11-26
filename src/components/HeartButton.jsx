import { useFavorites } from "../context/favorites";

export default function HeartButton({ movie, className = "" }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(movie.id);

  return (
    <button
      type="button"
      className={`heart ${saved ? "saved" : ""} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
      onClick={() => toggleFavorite(movie)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}