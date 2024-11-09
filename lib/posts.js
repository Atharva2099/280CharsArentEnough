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

function getImagePath(slug) {
  // Convert the slug to kebab case for image matching
  const imageSlug = slug.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Check different image extensions
  const extensions = ['png', 'jpg', 'jpeg', 'gif'];
  
  for (const ext of extensions) {
    const imagePath = path.join(process.cwd(), 'public', 'images', `${imageSlug}.${ext}`);
    if (fs.existsSync(imagePath)) {
      return `/images/${imageSlug}.${ext}`;
    }
  }

  // Log when no image is found
  console.log(`No image found for: ${slug}, using default`);
  return '/images/default.jpg';
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

      // Add basePath for production
      const basePath = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
      const imagePath = getImagePath(slug);

      console.log(`Processing: ${slug}, Image path: ${imagePath}`);

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

  // Process YouTube links in content
  let htmlContent = content;
  
  // Replace YouTube links with embeds
  htmlContent = htmlContent.replace(
    /https:\/\/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]+)(?:\?[^&\n]*)?/g,
    (match, videoId) => createYouTubeEmbed(`https://youtube.com/watch?v=${videoId}`)
  );

  // Add basePath to images in production
  if (process.env.NODE_ENV === 'production') {
    htmlContent = htmlContent.replace(
      /src="\/images\//g,
      'src="/280CharsArentEnough/images/'
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