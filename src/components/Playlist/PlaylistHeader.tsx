import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'

type PlaylistHeaderProps = {
  isVisible: boolean
  onToggleVisibility: () => void
}

export const PlaylistHeader = ({
  isVisible,
  onToggleVisibility
}: PlaylistHeaderProps) => {
  const { videos, isResetting, resetToDefault } = useVideoPlayerStore()
  const { isWebcamActive } = useWebcamStore()

  return (
    <div className='flex justify-between items-center'>
      <h3 className='text-gray-900 dark:text-white font-medium'>Playlist</h3>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {videos.length} videos
        </span>
        <button
          onClick={resetToDefault}
          className='p-2 hover:bg-gray-200 dark:hover:bg-[#202024] rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent'
          title='Reset to default videos'
          disabled={isResetting || isWebcamActive}
        >
          <svg
            className={`w-4 h-4 text-gray-900 dark:text-white ${
              isResetting ? 'animate-spin-reverse' : ''
            }`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            />
          </svg>
        </button>
        <button
          onClick={onToggleVisibility}
          className='p-2 hover:bg-gray-200 dark:hover:bg-[#202024] rounded-full transition-colors'
          title={isVisible ? 'Hide playlist' : 'Show playlist'}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`w-4 h-4 text-gray-900 dark:text-white transform transition-transform ${
              !isVisible ? 'rotate-180' : 'rotate-0'
            }`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 15l7-7 7 7'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
