import { VideoJS } from '@/components/VideoJS'
import { NavigationButton } from '@/components/NavigationButton'
import Player from 'video.js/dist/types/player'
import { IVideo } from '@/types/video.types'

type VideoJsOptions = {
  autoplay: boolean
  controls: boolean
  responsive: boolean
  fluid: boolean
  aspectRatio: string
  preload: string
  poster: string
}

type VideoPlayerProps = {
  videos: IVideo[]
  currentVideoIndex: number
  videoJsOptions: VideoJsOptions
  handlePlayerReady: (player: Player) => void
  isPosterLoading: boolean
  resetToDefault: () => void
  isInitialLoading?: boolean
  error?: string | null
  fetchVideos: () => void
  handleVideoChange: (index: number) => void
}

export const VideoPlayer = ({
  videos,
  currentVideoIndex,
  videoJsOptions,
  handlePlayerReady,
  isPosterLoading,
  resetToDefault,
  isInitialLoading,
  error,
  fetchVideos,
  handleVideoChange
}: VideoPlayerProps) => {
  return (
    <div className='relative w-full group'>
      {isInitialLoading ? (
        <div className='aspect-video bg-gray-100 dark:bg-[#121214] flex items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin' />
            <span className='text-gray-600 dark:text-gray-400'>
              Loading videos...
            </span>
          </div>
        </div>
      ) : error ? (
        <div className='aspect-video bg-gray-100 dark:bg-[#121214] flex items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <div className='text-red-500 mb-2'>{error}</div>
            <button
              onClick={fetchVideos}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
            >
              Try Again
            </button>
          </div>
        </div>
      ) : !videos.length ? (
        <div className='aspect-video bg-gray-100 dark:bg-[#121214] flex items-center justify-center'>
          <div className='flex flex-col items-center gap-4 text-center px-4'>
            <svg
              className='w-12 h-12 text-gray-400 mb-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 4v16M17 4v16M3 8h18M3 16h18'
              />
            </svg>
            <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
              No Videos Available
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              There are currently no videos in the playlist.
            </p>
            <div className='flex gap-2'>
              <button
                onClick={fetchVideos}
                className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              >
                Refresh
              </button>
              <button
                onClick={resetToDefault}
                className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {currentVideoIndex !== 0 && (
            <NavigationButton
              direction='prev'
              onClick={() => handleVideoChange(currentVideoIndex - 1)}
            />
          )}

          <div className='relative'>
            {isPosterLoading ? (
              <div className='w-full aspect-video bg-black flex items-center justify-center'>
                <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin' />
              </div>
            ) : (
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            )}
          </div>

          {currentVideoIndex !== videos.length - 1 && (
            <NavigationButton
              direction='next'
              onClick={() => handleVideoChange(currentVideoIndex + 1)}
            />
          )}
        </>
      )}
    </div>
  )
}
