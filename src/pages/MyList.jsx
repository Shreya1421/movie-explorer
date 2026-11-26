import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/favorites";

export default function MyList() {
  const { favorites } = useFavorites();

  return (
    <main className="browse">
      <h1>My List</h1>

      {favorites.length === 0 ? (
        <p className="status">
          Your list is empty. Tap the heart on any movie to save it here.{" "}
          <Link to="/browse" className="plain-link">Browse movies</Link>
        </p>
      ) : (
        <div className="results">
          {favorites.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}
    </main>
  );
}