import { useEffect, useRef } from 'react';

export default function VideoPlayer({ videoId }) {
  const getEmbedUrl = (id) => {
    // Clean the ID from any URL parameters
    const cleanId = id.replace('https://youtu.be/', '')
                     .replace('https://www.youtube.com/watch?v=', '')
                     .replace('https://youtube.com/watch?v=', '')
                     .split('&')[0]
                     .split('?')[0];
    
    return `https://www.youtube.com/embed/${cleanId}`;
  };

  return (
    <div className="video-container">
      <iframe
        width="100%"
        height="500"
        src={getEmbedUrl(videoId)}
        title="YouTube Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}