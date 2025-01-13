import Image from 'next/image'
import CheckboxSelected from '@/assets/images/CheckboxSelected.svg'
import CheckboxUnselected from '@/assets/images/CheckboxUnselected.svg'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'

export const Playlist = () => {
  const {
    currentVideoIndex,
    videos,
    isResetting,
    deletingId,
    deleteVideo,
    resetToDefault,
    setCurrentVideoIndex
  } = useVideoPlayerStore()

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex justify-between items-center'>
        <h3 className='text-gray-900 dark:text-white font-medium'>Playlist</h3>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600 dark:text-gray-400'>
            {videos.length} videos
          </span>
          <button
            onClick={resetToDefault}
            className='p-2 text-sm hover:text-blue-600 transition-colors'
            title='Reset to default videos'
            disabled={isResetting}
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
        </div>
      </div>

      <div className='space-y-4'>
        {videos.map((video, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded ${
              currentVideoIndex === index
                ? 'bg-gray-300 dark:bg-[#29292e]'
                : 'bg-gray-200 dark:bg-[#202024] hover:bg-gray-300 dark:hover:bg-[#29292e]'
            }`}
          >
            {currentVideoIndex === index ? (
              <Image
                src={CheckboxSelected}
                alt='Checkbox selected'
                className='w-auto h-auto'
                width={16}
                height={16}
              />
            ) : (
              <Image
                src={CheckboxUnselected}
                alt='Checkbox unselected'
                className='w-auto h-auto'
                width={16}
                height={16}
              />
            )}
            <div
              className='flex-1 flex items-center gap-2 cursor-pointer overflow-hidden'
              onClick={() =>
                currentVideoIndex !== index && setCurrentVideoIndex(index)
              }
            >
              <div className='flex justify-between items-center w-full gap-3'>
                <h4 className='text-gray-900 dark:text-white font-medium text-sm overflow-hidden text-ellipsis'>
                  {video.title}
                </h4>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {video.duration}
                </span>
              </div>
            </div>
            <button
              onClick={async () => {
                await deleteVideo(video._id)
              }}
              disabled={deletingId === video._id}
              className='p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-400/10 disabled:opacity-50'
              title='Delete video'
            >
              {deletingId === video._id ? (
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent' />
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                >
                  <path
                    fillRule='evenodd'
                    d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
