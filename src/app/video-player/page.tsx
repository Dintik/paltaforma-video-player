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

export default function VideoPlayerPage() {
  const { currentVideoIndex, videos, fetchVideos, setCurrentVideoIndex } =
    useVideoPlayerStore()
  const { generatePoster, posters } = usePosterStore()
  const { isWebcamActive, startWebcam, stopWebcam } = useWebcamStore()

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

  const handleWebcamToggle = async () => {
    if (isWebcamActive) {
      stopWebcam()
    } else {
      await startWebcam()
    }
  }

  return (
    <Container>
      <div className='flex justify-between'>
        <div className='w-[626px] flex flex-col'>
          <div className='flex justify-end mb-4'>
            <button
              onClick={handleWebcamToggle}
              className='px-4 py-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors'
            >
              {isWebcamActive ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
          </div>
          <VideoPlayer
            videoJsOptions={videoJsOptions}
            handlePlayerReady={handlePlayerReady}
          />

          {!isWebcamActive && (
            <div className='py-6'>
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

        <div className='w-[295px] bg-gray-100 dark:bg-[#121214] py-6 px-3 h-fit'>
          <AddVideoForm />
          <Playlist />
        </div>
      </div>
    </Container>
  )
}
