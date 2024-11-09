export function getYouTubeEmbedUrl(url) {
  // Handle different YouTube URL formats and clean the URL
  const videoId = url.replace('https://youtu.be/', '')
                    .replace('https://www.youtube.com/watch?v=', '')
                    .replace('https://youtube.com/watch?v=', '')
                    .split('&')[0]
                    .split('?')[0];  // Added to handle any additional parameters
  return `https://www.youtube.com/embed/${videoId}`;
}

export function createYouTubeEmbed(url) {
  const embedUrl = getYouTubeEmbedUrl(url);
  return `
    <div class="video-container">
      <iframe
        width="100%"
        height="500"
        src="${embedUrl}"
        title="YouTube Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  `;
}