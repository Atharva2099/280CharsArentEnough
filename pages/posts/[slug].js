import Link from 'next/link';
import { useEffect } from 'react';
import Layout from '../../components/Layout';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderMarkdown } from '../../lib/posts';
import { createYouTubeEmbed } from '../../utils/youtube';

function stripLeadingH1(markdown) {
  const lines = markdown.split('\n');
  const firstContentLine = lines.findIndex(line => line.trim() !== '');

  if (firstContentLine !== -1 && /^#\s+/.test(lines[firstContentLine])) {
    lines.splice(firstContentLine, 1);

    while (firstContentLine < lines.length && lines[firstContentLine].trim() === '') {
      lines.splice(firstContentLine, 1);
    }
  }

  return lines.join('\n');
}

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

  // Format the date
  const formattedDate = new Date(postData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <article className="blog-post">
        <header className="blog-post-header">
          <h1>{postData.title}</h1>
          <div className="text-muted">{formattedDate}</div>

          {postData.categories && postData.categories.length > 0 && (
            <div className="timeline-categories">
              {postData.categories.map((category, idx) => (
                <span key={category}>
                  <Link
                    href={`/?category=${encodeURIComponent(category)}`}
                    className="timeline-category"
                  >
                    {category}
                  </Link>
                  {idx < postData.categories.length - 1 && <span className="category-separator">•</span>}
                </span>
              ))}
            </div>
          )}

          {postData.summary ? <p className="blog-summary">{postData.summary}</p> : null}
        </header>

        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: postData.htmlContent }} />

        <footer className="blog-post-footer">
          <Link href="/" className="back-link">
            Back to home
          </Link>
        </footer>
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fileNames = fs.readdirSync(postsDirectory);
  
  const paths = fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, '')
      }
    };
  });
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const fullPath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let htmlContent = stripLeadingH1(content);
  
  // Replace YouTube links with embeds
  htmlContent = htmlContent.replace(
    /https:\/\/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)(?:\?[^&\n]*)?/g,
    (match, videoId) => createYouTubeEmbed(`https://youtube.com/watch?v=${videoId}`)
  );

  // Add basePath to images in production
  if (process.env.NODE_ENV === 'production') {
    // Handle markdown image syntax
    htmlContent = htmlContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, alt, src) => {
        if (src.startsWith('http')) return match;
        return `![${alt}](/280CharsArentEnough${src.startsWith('/') ? src : `/images/${src}`})`;
      }
    );

    // Handle HTML img tags
    htmlContent = htmlContent.replace(
      /<img[^>]+src="([^"]+)"[^>]*>/g,
      (match, src) => {
        if (src.startsWith('http')) return match;
        return match.replace(src, `/280CharsArentEnough${src.startsWith('/') ? src : `/images/${src}`}`);
      }
    );
  }
  
  // Extract summary from content if not provided in frontmatter
  const summary = data.summary || "";

  return {
    props: {
      postData: {
        slug: params.slug,
        htmlContent: renderMarkdown(htmlContent),
        title: data.title || params.slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categories: data.categories || [],
        image: data.image || null,
        summary: summary
      }
    }
  };
}
