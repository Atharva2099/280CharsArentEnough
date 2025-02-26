import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';
import Timeline from '../components/Timeline';
import Layout from '../components/Layout';
import { extractSummary } from '../lib/posts';

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert slug to match image filename format
    const imageSlug = slug.toLowerCase().replace(/ /g, '-');
    
    // Check multiple image formats
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    let imagePath = '/images/default.jpg';
    
    for (const ext of imageExtensions) {
      const imgPath = path.join(process.cwd(), 'public', 'images', `${imageSlug}.${ext}`);
      if (fs.existsSync(imgPath)) {
        imagePath = `/images/${imageSlug}.${ext}`;
        break;
      }
    }

    // If frontmatter specifies an image, use that instead
    if (data.image) {
      const customImgPath = path.join(process.cwd(), 'public', data.image.startsWith('/') ? data.image.slice(1) : `images/${data.image}`);
      if (fs.existsSync(customImgPath)) {
        imagePath = data.image.startsWith('/') ? data.image : `/images/${data.image}`;
      }
    }

    // Extract first paragraph as summary if no summary in frontmatter
    let summary = data.summary;
    if (!summary) {
      // Find first paragraph (text not starting with # and ending with newline)
      const paragraphMatch = content.match(/^(?:(?!^#).*$)(?:\n|$)/m);
      if (paragraphMatch) {
        summary = paragraphMatch[0].trim();
        // Truncate if needed
        if (summary.length > 160) {
          summary = summary.substring(0, 160).trim() + '...';
        }
      }
    }

    return {
      slug,
      title: data.title || filename.replace('.md', ''),
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      categories: data.categories || [],
      image: imagePath,
      summary: summary || 'Read this post to learn more...',
      content: content
    };
  });

  // Count category occurrences
  const categoryCount = posts.reduce((acc, post) => {
    post.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {});

  // Get top 10 categories
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([category]) => category);

  const sortedPosts = posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

  return {
    props: {
      posts: sortedPosts,
      topCategories
    }
  };
}

export default function Home({ posts, topCategories }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || post.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <SearchBar 
        onSearch={setSearchQuery} 
        initialValue={searchQuery}
      />

      {topCategories.length > 0 && (
        <div className="categories-container">
          <div className="category-list">
            <Link 
              href="/"
              className={`timeline-category ${!selectedCategory ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('');
              }}
            >
              All
            </Link>
            {topCategories.map(category => (
              <Link
                key={category}
                href={`/?category=${category}`}
                className={`timeline-category ${category === selectedCategory ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category);
                }}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Timeline posts={filteredPosts} />
    </Layout>
  );
}