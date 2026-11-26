import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies }) {
  const scroller = useRef(null);

  function scroll(direction) {
    const el = scroller.current;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-wrap">
        <button className="arrow left" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>
          ‹
        </button>
        <div className="row-scroller" ref={scroller}>
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        <button className="arrow right" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>
          ›
        </button>
      </div>
    </section>
  );
}