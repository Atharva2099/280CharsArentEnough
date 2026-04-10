import Link from 'next/link';

export default function PostGrid({ posts }) {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <section className="post-list" aria-live="polite">
      {sortedPosts.map(post => {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        const isResearch = post.type === 'research';
        const itemClassName = `post-row ${isResearch ? 'research' : ''}`.trim();
        const destination = post.external_url || `/posts/${encodeURIComponent(post.slug)}`;
        const isExternal = Boolean(post.external_url);

        const body = (
          <>
            <div className="post-row-accent" aria-hidden="true" />
            <div className="post-row-content">
              <p className="post-date">{formattedDate}</p>
              {isResearch && <span className="research-badge">Research</span>}
              <h2 className="post-title">{post.title}</h2>
              <p className="post-summary">{post.summary}</p>
              {post.categories?.length > 0 && (
                <div className="post-tags">
                  {post.categories.map(category => (
                    <span className="post-tag" key={`${post.slug}-${category}`}>
                      {category}
                    </span>
                  ))}
                </div>
              )}
              <span className="read-more-link">
                Read more <span className="read-more-arrow">→</span>
              </span>
            </div>
          </>
        );

        if (isExternal) {
          return (
            <article key={post.slug} className={itemClassName}>
              <a href={destination} target="_blank" rel="noreferrer" className="post-row-link">
                {body}
              </a>
            </article>
          );
        }

        return (
          <article key={post.slug} className={itemClassName}>
            <Link href={destination} className="post-row-link">
              {body}
            </Link>
          </article>
        );
      })}
    </section>
  );
}
