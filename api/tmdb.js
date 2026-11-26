const ALLOWED = /^\/(trending|movie|search|discover|genre)(\/|$)/;

export default async function handler(req, res) {
  const { path = "", ...params } = req.query;

  if (typeof path !== "string" || !ALLOWED.test(path) || path.includes("..")) {
    return res.status(400).json({ error: "Path not allowed" });
  }

  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") url.searchParams.set(key, value);
  });

  try {
    const upstream = await fetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    const data = await upstream.json();
    if (upstream.ok) {
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    }
    return res.status(upstream.status).json(data);
  } catch {
    return res.status(502).json({ error: "Could not reach TMDB" });
  }
}