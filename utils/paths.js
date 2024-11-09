export function getAssetPath(path) {
    const basePath = process.env.NODE_ENV === 'production' ? '/280CharsArentEnough' : '';
    return `${basePath}${path}`;
  }
  
  export function getYouTubeEmbedUrl(url) {
    // Handle different YouTube URL formats
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
  }