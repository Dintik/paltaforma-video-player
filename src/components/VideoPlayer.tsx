'use client'

import { useRef, useEffect, useMemo } from 'react'
import videojs from 'video.js'
import { VideoJS } from '@/components/VideoJS'
import { NavigationButton } from '@/components/NavigationButton'
import Player from 'video.js/dist/types/player'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { usePosterStore } from '@/store/posterStore'
import { useWebcamStore } from '@/store/webcamStore'

export const VideoPlayer = () => {
  const {
    currentVideoIndex,
    videos,
    isInitialLoading,
    error,
    fetchVideos,
    resetToDefault,
    setCurrentVideoIndex
  } = useVideoPlayerStore()

  const {
    generatePoster,
    posters,
    isLoading: isPosterLoading
  } = usePosterStore()
  const { isWebcamActive, stopWebcam } = useWebcamStore()

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
            <div className='flex gap-5'>
              <button
                onClick={fetchVideos}
                className='w-full px-6 py-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors disabled:opacity-50'
              >
                Refresh
              </button>
              <button
                onClick={resetToDefault}
                className='w-full px-6 py-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors disabled:opacity-50'
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {!isWebcamActive && currentVideoIndex !== 0 && (
            <NavigationButton
              direction='prev'
              onClick={() => setCurrentVideoIndex(currentVideoIndex - 1)}
            />
          )}

          <div className='relative'>
            {isCurrentPosterLoading ? (
              <div className='w-full aspect-video bg-black flex items-center justify-center'>
                <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin' />
              </div>
            ) : (
              <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
            )}
          </div>

          {!isWebcamActive && currentVideoIndex !== videos.length - 1 && (
            <NavigationButton
              direction='next'
              onClick={() => setCurrentVideoIndex(currentVideoIndex + 1)}
            />
          )}
        </>
      )}
    </div>
  )
}
