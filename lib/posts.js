// File: /lib/posts.js
import MarkdownIt from 'markdown-it';
import highlightjs from 'highlight.js';

// Create markdown parser with custom highlighting
const md = new MarkdownIt({ 
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && highlightjs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               highlightjs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

/**
 * Extracts a summary from post content
 * @param {string} markdown - Markdown content
 * @param {number} maxLength - Maximum length of summary
 * @returns {string} - Summary text
 */
function extractFirstParagraph(markdown, maxLength = 160) {
  // Find the first paragraph in markdown (text not starting with # and ending with newline)
  const paragraphMatch = markdown.match(/^(?:(?!^#).*$)(?:\n|$)/m);
  
  if (paragraphMatch) {
    const paragraph = paragraphMatch[0].trim();
    
    // Remove markdown syntax
    const cleanParagraph = paragraph
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
      .replace(/\*(.*?)\*/g, '$1')      // Italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
    
    // Truncate if needed
    if (cleanParagraph.length > maxLength) {
      return cleanParagraph.substring(0, maxLength).trim() + '...';
    }
    
    return cleanParagraph;
  }
  
  return 'Read this post to learn more...';
}

/**
 * Extracts a summary from post object
 * @param {Object} post - Post object
 * @param {number} maxLength - Maximum length of summary
 * @returns {string} - Summary text
 */
export function extractSummary(post, maxLength = 160) {
  // If post has a summary in frontmatter, use it
  if (post.summary) return post.summary;
  
  // If we have content, extract from that
  if (post.content) {
    return extractFirstParagraph(post.content, maxLength);
  }
  
  return 'Read this post to learn more...';
}

/**
 * Render markdown to HTML
 */
export function renderMarkdown(content) {
  return md.render(content);
}