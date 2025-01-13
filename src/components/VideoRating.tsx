import { useState } from 'react'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'

export const VideoRating = () => {
  const { currentVideoIndex, videos, updateVideoRating } = useVideoPlayerStore()
  const currentVideo = videos[currentVideoIndex]
  const [isUpdating, setIsUpdating] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const handleRating = async (rating: number) => {
    if (!currentVideo || isUpdating) return

    setIsUpdating(true)
    try {
      await updateVideoRating(currentVideo._id, rating)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <span className='text-gray-600 dark:text-gray-400'>Rating:</span>
      <div className='flex gap-1' onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            disabled={isUpdating}
            className={`text-2xl transition-colors ${
              (hoverRating || currentVideo?.rating || 0) >= star
                ? 'text-yellow-400 dark:text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  )
}
