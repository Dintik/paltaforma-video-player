'use client'

import { useEffect, useRef } from 'react'
import Container from '@/components/Container'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'
import { useVideoPoster } from '@/hooks/useVideoPoster'
import { useVideoPlayer } from '@/hooks/useVideoPlayer'
import { Playlist } from '@/components/Playlist'
import { VideoPlayer } from '@/components/VideoPlayer'

export default function VideoPlayerPage() {
  const {
    currentVideoIndex,
    videos,
    isInitialLoading,
    isResetting,
    error,
    deletingId,
    fetchVideos,
    handleDeleteVideo,
    resetToDefault,
    setCurrentVideoIndex
  } = useVideoPlayer()

  const playerRef = useRef<Player>(null)
  const currentVideo = videos[currentVideoIndex]

  const { poster, isLoading: isPosterLoading } = useVideoPoster(
    currentVideo?.src,
    '/images/default-poster.png'
  )

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: '16:9',
    preload: 'auto',
    poster: poster,
    controlBar: {
      skipButtons: {
        backward: 10
      }
    },
    sources: currentVideo
      ? [
          {
            src: currentVideo.src,
            type: currentVideo.type
          }
        ]
      : []
  }

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player

    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }

  return (
    <Container>
      <div className='flex justify-between'>
        <div className='w-[626px] flex flex-col'>
          <VideoPlayer
            videos={videos}
            currentVideoIndex={currentVideoIndex}
            videoJsOptions={videoJsOptions}
            handlePlayerReady={handlePlayerReady}
            isPosterLoading={isPosterLoading}
            resetToDefault={resetToDefault}
            isInitialLoading={isInitialLoading}
            error={error}
            fetchVideos={fetchVideos}
            handleVideoChange={setCurrentVideoIndex}
          />

          {currentVideo?.description && (
            <div className='py-6'>
              <h2 className='text-xl font-medium text-gray-900 dark:text-white mb-4'>
                Description
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                {currentVideo.description}
              </p>
            </div>
          )}
        </div>

        <Playlist
          videos={videos}
          currentVideoIndex={currentVideoIndex}
          onVideoSelect={setCurrentVideoIndex}
          onDeleteVideo={async (id) => {
            await handleDeleteVideo(id)
          }}
          deletingId={deletingId}
          isResetting={isResetting}
          onReset={resetToDefault}
        />
      </div>
    </Container>
  )
}
