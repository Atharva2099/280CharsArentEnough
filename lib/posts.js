import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import prism from 'markdown-it-prism';

const postsDirectory = path.join(process.cwd(), 'posts');
const md = new MarkdownIt({ 
  html: true,
  linkify: true,
  typographer: true 
}).use(prism);

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      return {
        params: {
          slug: fileName.replace(/\.md$/, '')
        }
      };
    });
}

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Use image from frontmatter or fallback to naming convention
      const imagePath = data.image || `/images/${slug.toLowerCase().replace(/ /g, '-')}.png`;

      return {
        slug,
        ...data,
        image: imagePath,
        date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
    });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
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
  
  const htmlContent = md.render(content);

  // Convert slug to match the image filename format
  const imageSlug = slug.toLowerCase().replace(/ /g, '-');
  const imgPath = path.join(process.cwd(), 'public', 'images', `${imageSlug}.png`);
  console.log('Post image path:', imgPath);
  console.log('Post image exists:', fs.existsSync(imgPath));

  const imagePath = fs.existsSync(imgPath) 
    ? `/images/${imageSlug}.png`
    : '/images/default.jpg';

  console.log('Final post image path:', imagePath);

  return {
    slug,
    htmlContent,
    ...data,
    image: imagePath,
    date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  };
}