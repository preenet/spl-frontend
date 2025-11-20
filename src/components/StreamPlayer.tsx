import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface StreamPlayerProps {
  src: string;
  className?: string;
  onClick?: () => void;
  muted?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  style?: React.CSSProperties;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({
  src,
  className,
  onClick,
  muted = true,
  autoPlay = false,
  controls = false,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      className={className}
      onClick={onClick}
      muted={muted}
      autoPlay={autoPlay}
      controls={controls}
      playsInline
      style={style}
    />
  );
};

export default StreamPlayer;
