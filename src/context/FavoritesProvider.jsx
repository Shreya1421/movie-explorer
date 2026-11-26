import { useEffect, useState } from "react";
import { FavoritesContext } from "./favorites";

const KEY = "movie-explorer-favorites";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Keep only what the cards need, so the list stays small
function slim(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
  };
}

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites));
    } catch {
      /* storage is unavailable, so the list lasts only for this visit */
    }
  }, [favorites]);

  function isFavorite(id) {
    return favorites.some((f) => f.id === id);
  }

  function toggleFavorite(movie) {
    setFavorites((list) =>
      list.some((f) => f.id === movie.id)
        ? list.filter((f) => f.id !== movie.id)
        : [slim(movie), ...list]
    );
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}