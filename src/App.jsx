import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import MovieDetail from "./pages/MovieDetail";
import MyList from "./pages/MyList";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/my-list" element={<MyList />} />
        <Route
          path="*"
          element={
            <main className="browse">
              <h1>Page not found</h1>
              <p className="status">
                That page doesn’t exist.{" "}
                <Link to="/" className="plain-link">Go back home</Link>
              </p>
            </main>
          }
        />
      </Routes>
      <footer>
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </footer>
    </div>
  );
}