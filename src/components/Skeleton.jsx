export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="results" aria-busy="true" aria-label="Loading movies">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton-card" />
      ))}
    </div>
  );
}

export function SkeletonHome() {
  return (
    <main aria-busy="true" aria-label="Loading movies">
      <div className="skeleton skeleton-hero" />
      <div className="rows">
        {[0, 1].map((r) => (
          <section key={r} className="row">
            <div className="skeleton skeleton-title" />
            <div className="row-scroller">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="skeleton skeleton-card row-skel" />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}