import Link from 'next/link';
import { getAllPostIds, getPostData } from '../../lib/posts';
import { useEffect } from 'react';

export default function Post({ postData }) {
  // Add error handling for video iframes
  useEffect(() => {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.onerror = () => {
        console.error(`Failed to load iframe: ${iframe.src}`);
      };
    });
  }, []);

  return (
    <div className="blog-post">
      <h1>{postData.title}</h1>
      <div className="text-muted mb-4">{postData.date}</div>
      {postData.categories && (
        <div className="mb-4">
          {postData.categories.map(category => (
            <span key={category} className="badge bg-secondary me-2">
              {category}
            </span>
          ))}
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: postData.htmlContent }} />
      <Link href="/" className="btn btn-primary mt-4">
        ← Back to Home
      </Link>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const postData = getPostData(params.slug);
  return {
    props: {
      postData
    }
  };
}