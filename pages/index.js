import { useEffect, useMemo, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';
import PostGrid from '../components/Timeline';
import Layout from '../components/Layout';

const BUCKETS = [
  {
    name: 'Research',
    members: ['research', 'rl', 'llm', 'distillation', 'rppg', 'rag', 'machine learning', 'ai']
  },
  {
    name: 'Projects',
    members: ['projects', 'project', 'hackathon', 'demo', 'build', 'react']
  },
  {
    name: 'Explainers',
    members: ['explainers', 'tutorial', 'walkthrough', 'how-to', 'how to', 'guide']
  },
  {
    name: 'Algorithms',
    members: ['algorithms', 'leetcode', 'dsa', 'data structure and algorithms', 'monte carlo', 'backtracking', 'n-queens']
  },
  {
    name: 'Systems',
    members: ['systems', 'c', 'os', 'operating systems', 'low-level', 'low level', 'networking', 'programming']
  }
];

function postMatchesBucket(post, selectedBucket) {
  if (!selectedBucket) return true;
  const bucket = BUCKETS.find(item => item.name === selectedBucket);
  if (!bucket) return true;

  const categorySet = new Set((post.categories || []).map(category => String(category).toLowerCase().trim()));
  return bucket.members.some(member => categorySet.has(member));
}

function postMatchesCategory(post, selectedCategory) {
  if (!selectedCategory) return true;

  const bucketExists = BUCKETS.some(bucket => bucket.name === selectedCategory);
  if (bucketExists) {
    return postMatchesBucket(post, selectedCategory);
  }

  const normalizedSelectedCategory = selectedCategory.toLowerCase().trim();
  return (post.categories || []).some(category => String(category).toLowerCase().trim() === normalizedSelectedCategory);
}

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const imageSlug = slug.toLowerCase().replace(/ /g, '-');
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    let imagePath = '/images/default.jpg';

    for (const ext of imageExtensions) {
      const imgPath = path.join(process.cwd(), 'public', 'images', `${imageSlug}.${ext}`);
      if (fs.existsSync(imgPath)) {
        imagePath = `/images/${imageSlug}.${ext}`;
        break;
      }
    }

    if (data.image) {
      const rawImage = String(data.image);
      const customImgPath = path.join(
        process.cwd(),
        'public',
        rawImage.startsWith('/') ? rawImage.slice(1) : `images/${rawImage}`
      );
      if (fs.existsSync(customImgPath)) {
        imagePath = rawImage.startsWith('/') ? rawImage : `/images/${rawImage}`;
      }
    }

    return {
      slug,
      title: data.title || filename.replace('.md', ''),
      date: data.date
        ? new Date(data.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      categories: Array.isArray(data.categories) ? data.categories.map(category => String(category).trim()) : [],
      image: imagePath,
      summary: data.summary || 'Read this post to learn more...',
      type: data.type || 'post',
      external_url: data.external_url || null,
      status: data.status || null,
      content
    };
  });

  const sortedPosts = posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

  return {
    props: {
      posts: sortedPosts,
      buckets: BUCKETS.map(bucket => bucket.name)
    }
  };
}

export default function Home({ posts, buckets }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    const category = typeof router.query.category === 'string' ? router.query.category : '';
    if (category) {
      setSelectedCategory(category);
      return;
    }
    setSelectedCategory('');
  }, [router.isReady, router.query.category]);

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return posts.filter(post => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.categories.some(category => category.toLowerCase().includes(q));

      const matchesCategory = postMatchesCategory(post, selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleCategoryChange = category => {
    setSelectedCategory(category);

    const query = category ? { category } : {};
    router.replace(
      {
        pathname: '/',
        query
      },
      undefined,
      { shallow: true }
    );
  };
  return (
    <Layout>
      <section className="home-toolbar">
        <SearchBar onSearch={setSearchQuery} initialValue={searchQuery} />

        <div className="filter-bar" role="tablist" aria-label="Post categories">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {buckets.map(bucket => (
            <button
              key={bucket}
              type="button"
              className={`filter-pill ${selectedCategory === bucket ? 'active' : ''}`}
              onClick={() => handleCategoryChange(bucket)}
            >
              {bucket}
            </button>
          ))}
        </div>
      </section>

      <PostGrid posts={filteredPosts} />
    </Layout>
  );
}
