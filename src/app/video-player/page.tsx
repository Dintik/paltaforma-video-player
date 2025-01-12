'use client'

import { useEffect, useRef, useMemo } from 'react'
import Container from '@/components/Container'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'
import { usePosterStore } from '@/store/posterStore'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
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
    deleteVideo,
    resetToDefault,
    setCurrentVideoIndex
  } = useVideoPlayerStore()

  const {
    generatePoster,
    posters,
    isLoading: isPosterLoading
  } = usePosterStore()

  const playerRef = useRef<Player>(null)
  const currentVideo = videos[currentVideoIndex]

  const currentPoster = currentVideo?.src
    ? posters[currentVideo.src]
    : undefined
  const isCurrentPosterLoading = isPosterLoading(currentVideo?.src)

  useEffect(() => {
    if (currentVideo?.src) {
      generatePoster(currentVideo.src)
    }

    if (playerRef.current && currentPoster) {
      try {
        playerRef.current.poster(currentPoster)
      } catch (error) {
        console.warn('Failed to set video poster:', error)
      }
    }
  }, [currentPoster, currentVideo?.src, generatePoster])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const videoJsOptions = useMemo(
    () => ({
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: '16:9',
      preload: 'auto',
      poster: currentPoster || '/images/default-poster.png',
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
    }),
    [currentVideo, currentPoster]
  )

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
            isPosterLoading={isCurrentPosterLoading}
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
            await deleteVideo(id)
          }}
          deletingId={deletingId}
          isResetting={isResetting}
          onReset={resetToDefault}
        />
      </div>
    </Container>
  )
}
