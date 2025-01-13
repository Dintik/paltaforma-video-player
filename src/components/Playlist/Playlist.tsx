import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useState } from 'react'
import { PlaylistHeader } from './PlaylistHeader'
import { PlaylistItem } from './PlaylistItem'

export const Playlist = () => {
  const { videos } = useVideoPlayerStore()
  const [isVisible, setIsVisible] = useState(true)

  return (
    <div className='flex flex-col gap-3'>
      <PlaylistHeader
        isVisible={isVisible}
        onToggleVisibility={() => setIsVisible(!isVisible)}
      />

      {isVisible && (
        <div className='space-y-4'>
          {videos.map((video, index) => (
            <PlaylistItem key={video._id} video={video} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
