import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PostCard({ post }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ 
              objectFit: 'cover',
              borderTopLeftRadius: '0.375rem',
              borderTopRightRadius: '0.375rem'
            }}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{post.title}</h5>
          <div className="text-muted small mb-2">{post.date}</div>
          {post.categories && (
            <div className="mb-2">
              {post.categories.map(category => (
                <Link 
                  key={category}
                  href={`/?category=${category}`}
                  className="badge bg-secondary text-decoration-none me-1"
                >
                  {category}
                </Link>
              ))}
            </div>
          )}
          <Link 
            href={`/posts/${encodeURIComponent(post.slug)}`}
            className="btn btn-primary mt-auto"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}