import { usePosterStore } from '@/store/posterStore'
import { useEffect } from 'react'

export const useVideoPoster = (videoSrc: string | undefined) => {
  const { generatePoster, posters, isLoading } = usePosterStore()
  const currentPoster = videoSrc ? posters[videoSrc] : undefined
  const isCurrentPosterLoading = videoSrc ? isLoading(videoSrc) : false

  useEffect(() => {
    if (videoSrc) {
      generatePoster(videoSrc)
    }
  }, [videoSrc, generatePoster])

  return {
    currentPoster,
    isCurrentPosterLoading
  }
}
