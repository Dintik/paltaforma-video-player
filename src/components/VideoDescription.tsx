import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { VideoRating } from '@/components/VideoRating'

export const VideoDescription = () => {
  const { currentVideoIndex, videos } = useVideoPlayerStore()
  const currentVideo = videos[currentVideoIndex]

  return (
    <div className='py-4 lg:py-6'>
      <div className='flex justify-between items-start mb-4'>
        <h2 className='text-xl font-medium text-gray-900 dark:text-white'>
          Description
        </h2>
        <VideoRating />
      </div>
      <p className='text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis'>
        {currentVideo?.description ?? 'No description'}
      </p>
    </div>
  )
}
