'use client'

import { useEffect, useRef, useMemo } from 'react'
import Container from '@/components/Container'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'
import { usePosterStore } from '@/store/posterStore'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'
import { Playlist } from '@/components/Playlist'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AddVideoForm } from '@/components/AddVideoForm'
import { VideoRating } from '@/components/VideoRating'
import { CameraControls } from '@/components/CameraControls'

export default function VideoPlayerPage() {
  const { currentVideoIndex, videos, fetchVideos, setCurrentVideoIndex } =
    useVideoPlayerStore()
  const { generatePoster, posters } = usePosterStore()
  const { isWebcamActive, stopWebcam } = useWebcamStore()

  const playerRef = useRef<Player>(null)
  const currentVideo = videos[currentVideoIndex]

  const currentPoster = currentVideo?.src
    ? posters[currentVideo.src]
    : undefined

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
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      aspectRatio: '16:9',
      preload: 'auto',
      poster: currentPoster || '/images/default-poster.png',
      controlBar: {
        skipButtons: {
          backward: 10,
          forward: 10
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
      if (isWebcamActive) {
        stopWebcam()
      }
    })

    player.on('ended', () => {
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1)
      }
    })
  }

  return (
    <Container>
      <div className='flex flex-col-reverse lg:flex-row justify-between gap-6'>
        <div className='w-full lg:w-[626px] flex flex-col'>
          <CameraControls />
          <VideoPlayer
            videoJsOptions={videoJsOptions}
            handlePlayerReady={handlePlayerReady}
          />

          {!isWebcamActive && (
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
          )}
        </div>

        <div className='w-full lg:w-[295px] bg-gray-100 dark:bg-[#121214] p-4 lg:py-6 lg:px-3 h-fit'>
          <AddVideoForm />

          <div className='border-b-2 border-gray-200 dark:border-gray-700 mb-4'></div>

          <Playlist />
        </div>
      </div>
    </Container>
  )
}
