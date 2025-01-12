import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PostCard({ post }) {
  const [imgError, setImgError] = useState(false);
  
  const getImagePath = (path) => {
    if (!path || typeof path !== 'string') {
      console.log('No valid path provided, using default');
      return '/images/default.jpg';
    }
    // Clean up the path
    const cleanPath = path.startsWith('/') ? path : `/images/${path}`;
    const basePath = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
    const fullPath = `${basePath}${cleanPath}`;
    
    console.log('Constructed full path:', fullPath);
    return fullPath;
  };
  
  // Ensure we always have an image path
  const defaultImage = '/images/default.jpg';
  const imageSrc = imgError ? getImagePath(defaultImage) : getImagePath(post.image || defaultImage);
  
  // Ensure we have 2 rows of categories
  const categories = post.categories || [];
  const filledCategories = [...categories];
  while (filledCategories.length < 6) {
    filledCategories.push(null);
  }
  
  return (
    <div className="col-md-4 mb-4">
      <div className="card bg-beige">
        <div className="card-img-container">
          <Image
            src={imageSrc}
            alt={post.title || 'Blog post image'}
            fill
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            onError={() => {
              console.error(`Image error for: ${post.title}`, imageSrc);
              setImgError(true);
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-2">{post.title}</h5>
          <div className="text-muted small mb-2">{post.date}</div>
          
          <div className="tags-container mb-3">
            <div className="d-flex flex-wrap gap-2">
              {filledCategories.map((category, index) => (
                category ? (
                  <Link
                    key={`${category}-${index}`}
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="badge bg-primary text-white text-decoration-none"
                  >
                    {category}
                  </Link>
                ) : (
                  <div key={`empty-${index}`} className="badge-placeholder"></div>
                )
              ))}
            </div>
          </div>

          <Link
            href={`/posts/${encodeURIComponent(post.slug)}`}
            className="btn btn-primary mt-auto align-self-start"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}