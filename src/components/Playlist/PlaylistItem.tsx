import Image from 'next/image'
import CheckboxSelected from '@/assets/images/CheckboxSelected.svg'
import CheckboxUnselected from '@/assets/images/CheckboxUnselected.svg'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'
import { IVideo } from '@/types/video.types'

type PlaylistItemProps = {
  video: IVideo
  index: number
}

export const PlaylistItem = ({ video, index }: PlaylistItemProps) => {
  const { currentVideoIndex, deletingId, deleteVideo, setCurrentVideoIndex } =
    useVideoPlayerStore()
  const { isWebcamActive } = useWebcamStore()

  const isSelected = currentVideoIndex === index
  const isDeleting = deletingId === video._id

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded ${
        isSelected
          ? 'bg-gray-300 dark:bg-[#29292e]'
          : 'bg-gray-200 dark:bg-[#202024] hover:bg-gray-300 dark:hover:bg-[#29292e]'
      } ${isWebcamActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() =>
        !isWebcamActive && !isSelected && setCurrentVideoIndex(index)
      }
    >
      <Image
        src={isSelected ? CheckboxSelected : CheckboxUnselected}
        alt={`Checkbox ${isSelected ? 'selected' : 'unselected'}`}
        className='w-auto h-auto'
        width={16}
        height={16}
      />

      <div className='flex-1 flex items-center gap-2 overflow-hidden'>
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
        onClick={(e) => {
          e.stopPropagation()
          deleteVideo(video._id)
        }}
        disabled={isDeleting || isWebcamActive}
        className='p-1.5 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-400/10 disabled:opacity-50 disabled:hover:text-current'
        title='Delete video'
      >
        {isDeleting ? (
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
  )
}
