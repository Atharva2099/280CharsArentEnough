import { useState } from 'react';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

export async function getStaticProps() {
  const fs = require('fs');
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
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

    return {
      slug,
      title: data.title || filename.replace('.md', ''),
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      categories: data.categories || [],
      image: imagePath
    };
  });

  // Count category occurrences
  const categoryCount = posts.reduce((acc, post) => {
    post.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {});

  // Get top 5 categories
  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
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
    <div>
      <SearchBar 
        onSearch={setSearchQuery} 
        initialValue={searchQuery}
      />

      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center">
          <div className="categories-container">
            <span className="category-label">Categories:</span>
            <div className="category-list">
              <Link 
                href="/"
                className={`badge ${!selectedCategory ? 'bg-primary' : 'bg-secondary'} text-decoration-none`}
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
                  className={`badge ${category === selectedCategory ? 'bg-primary' : 'bg-secondary'} text-decoration-none me-1`}
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
        </div>
      </div>

      <div className="row mt-4">
        {filteredPosts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}