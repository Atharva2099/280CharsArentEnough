import Link from 'next/link';
import { extractSummary } from '../lib/posts';

export default function Timeline({ posts }) {
  // Sort posts by date in descending order (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="timeline">
      <div className="timeline-items">
        {sortedPosts.map((post, index) => {
          // Format date for display
          const date = new Date(post.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          
          // Get only first 3 categories max
          const displayCategories = post.categories?.slice(0, 3) || [];
          
          // Get summary (first 160 characters or from frontmatter)
          const summary = post.summary || extractSummary(post);
          
          return (
            <div className="timeline-item" key={post.slug}>
              <div className="timeline-date">{formattedDate}</div>
              <div className="timeline-content">
                <h3 className="timeline-title">
                  <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                    {post.title}
                  </Link>
                </h3>
                
                {displayCategories.length > 0 && (
                  <div className="timeline-categories">
                    {displayCategories.map((category, idx) => (
                      <span key={`${post.slug}-${category}`}>
                        <Link
                          href={`/?category=${encodeURIComponent(category)}`}
                          className="timeline-category"
                        >
                          {category}
                        </Link>
                        {idx < displayCategories.length - 1 && <span style={{ color: '#666', margin: '0 4px' }}>•</span>}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="timeline-summary">{summary}</p>
                
                <Link
                  href={`/posts/${encodeURIComponent(post.slug)}`}
                  className="read-more"
                >
                  Read more →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}