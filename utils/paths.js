// File: /utils/paths.js

export function getAssetPath(path) {
  // If it's an absolute URL, return as is
  if (path.startsWith('http')) return path;
  
  const basePath = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getImagePath(path) {
  // If it's an absolute URL or already has /images/, return as is
  if (path.startsWith('http') || path.startsWith('/images/')) return path;
  
  // Otherwise, add /images/ prefix
  return `/images/${path}`;
}