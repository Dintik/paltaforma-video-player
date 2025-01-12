import { useState, useCallback, useEffect } from "react";

export const useVideoPoster = (videoUrl: string, defaultPoster?: string) => {
  const [poster, setPoster] = useState<string>(defaultPoster || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePoster = useCallback(async () => {
    if (!videoUrl) {
      console.log('No video URL provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Video loading timeout'));
        }, 3000); // 3 second timeout

        video.onloadedmetadata = () => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            reject(new Error('Invalid video dimensions'));
            return;
          }
          
          video.currentTime = 1;
        };

        video.onseeked = () => {
          try {
            clearTimeout(timeoutId);
            
            const canvas = document.createElement('canvas');
            const maxSize = 720;
            const scale = Math.min(1, maxSize / Math.max(video.videoWidth, video.videoHeight));
            
            canvas.width = Math.round(video.videoWidth * scale);
            canvas.height = Math.round(video.videoHeight * scale);

            const ctx = canvas.getContext('2d', {
              alpha: false, // Turn off transparency for better quality
              willReadFrequently: false // Optimize for single render
            });
            
            if (!ctx) {
              throw new Error('Failed to get canvas context');
            }
            
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const posterUrl = canvas.toDataURL('image/jpeg', 0.85);

            setPoster(posterUrl);
            resolve(posterUrl);
          } catch (err) {
            console.error('Error in poster generation:', err);
            reject(err);
          } finally {
            video.remove();
          }
        };

        video.onerror = () => {
          clearTimeout(timeoutId);
          console.error('Video loading error:', video.error);
          reject(new Error(`Failed to load video: ${video.error?.message || 'unknown error'}`));
        };

        video.onabort = () => {
          clearTimeout(timeoutId);
          reject(new Error('Video loading aborted'));
        };

        video.src = videoUrl;
        video.load();
      });
    } catch (err) {
      console.error('Poster generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate poster');
      if (defaultPoster) {
        setPoster(defaultPoster);
      }
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, defaultPoster]);

  useEffect(() => {
    generatePoster();
  }, [generatePoster]);

  return { poster, isLoading, error, regenerate: generatePoster };
}; 