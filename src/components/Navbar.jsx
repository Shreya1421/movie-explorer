import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useFavorites } from "../context/favorites";

export default function Navbar() {
    const navigate = useNavigate();
      const { favorites } = useFavorites();
    const { pathname } = useLocation();
    const [params] = useSearchParams();
    const startQuery = params.get("q") ?? "";

    const [text, setText] = useState(startQuery);
    const [open, setOpen] = useState(Boolean(startQuery));
    const [scrolled, setScrolled] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    function handleChange(e) {
        const value = e.target.value;
        setText(value);
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value)}`, {
                replace: pathname === "/search",
            });
        } else if (pathname === "/search") {
            navigate("/");
        }
    }

    function goHome() {
        setText("");
        setOpen(false);
    }

    return (
        <nav className={`navbar ${scrolled ? "solid" : ""}`}>
            <Link to="/" className="brand" onClick={goHome}>
                MOVIE EXPLORER
            </Link>
            <NavLink to="/" end className="nav-link" onClick={goHome}>
                Home
            </NavLink>
            <NavLink to="/browse" className="nav-link" onClick={goHome}>
                Browse
            </NavLink>
                  <NavLink to="/my-list" className="nav-link" onClick={goHome}>
        My List
        {favorites.length > 0 && <span className="count">{favorites.length}</span>}
      </NavLink>

            <div className="spacer" />

            <div className={`search ${open ? "open" : ""}`}>
                <button
                    type="button"
                    className="search-btn"
                    aria-label="Search"
                    onClick={() => setOpen(true)}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                    </svg>
                </button>
                <input
                    ref={inputRef}
                    type="search"
                    value={text}
                    onChange={handleChange}
                    onBlur={() => {
                        if (!text) setOpen(false);
                    }}
                    placeholder="Search movies"
                    aria-label="Search movies"
                />
            </div>
        </nav>
    );
}