// File: /lib/posts.js

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import prism from 'markdown-it-prism';
import { createYouTubeEmbed } from '../utils/youtube';

const postsDirectory = path.join(process.cwd(), 'posts');
const md = new MarkdownIt({ 
  html: true,
  linkify: true,
  typographer: true 
}).use(prism);

function getImagePath(imagePath) {

  console.log('Posts.js - Getting image path for:', imagePath);
  
  if (!imagePath) {
    console.log('Posts.js - No image path provided, using default');
    return '/images/default.jpg';
  }
  
  // Remove any leading /images/ if present
  const cleanPath = imagePath.replace(/^\/images\//, '');
  
  // Create full path and check if file exists
  const fullFilePath = path.join(process.cwd(), 'public', 'images', cleanPath);
  console.log('Posts.js - Checking file exists at:', fullFilePath);
  
  if (!fs.existsSync(fullFilePath)) {
    console.log('Posts.js - File not found, using default');
    return '/images/default.jpg';
  }
  
  return `/images/${cleanPath}`;

}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      console.log('Posts.js - Processing post:', slug);
      console.log('Posts.js - Image from frontmatter:', data.image);

      const basePath = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
      const imagePath = getImagePath(data.image);


      console.log('Posts.js - Final image path:', `${basePath}${imagePath}`);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categories: data.categories || [],
        image: `${basePath}${imagePath}`
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });
}

export function getPostData(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let htmlContent = content;
  
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

  return {
    slug,
    htmlContent: md.render(htmlContent),
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    categories: data.categories || [],
    image: data.image
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(path.join(process.cwd(), 'posts'));
  return fileNames.map(fileName => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, '')
      }
    };
  });
}