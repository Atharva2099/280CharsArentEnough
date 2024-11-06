import { useEffect, useRef } from 'react';

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        controls
        width="100%"
        preload="metadata"
      >
        <source src={src} type={`video/${src.split('.').pop()}`} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}