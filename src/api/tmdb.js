export const IMG = "https://image.tmdb.org/t/p/w500";
export const BACKDROP = "https://image.tmdb.org/t/p/w1280";
export const PROFILE = "https://image.tmdb.org/t/p/w185";

const BASE = "https://api.themoviedb.org/3";

// While coding (npm run dev) we call TMDB directly.
// On the deployed site we call our own /api/tmdb function instead.
const USE_PROXY = !import.meta.env.DEV;

export async function tmdb(path, params = {}) {
  const query = new URLSearchParams(params);
  const options = { signal: AbortSignal.timeout(10000) };
  let url;

  if (USE_PROXY) {
    query.set("path", path);
    url = `/api/tmdb?${query}`;
  } else {
    url = `${BASE}${path}?${query}`;
    options.headers = {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    };
  }

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
  return res.json();
}