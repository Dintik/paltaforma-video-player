'use client'

import { useEffect, useRef, useState } from 'react'
import { videoService } from '@/services/api'
import { IVideo } from '@/types/video.types'
import Image from 'next/image'
import Container from '@/components/Container'
import { VideoJS } from '@/components/VideoJS'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'
import CheckboxSelected from '@/assets/images/CheckboxSelected.svg'
import CheckboxUnselected from '@/assets/images/CheckboxUnselected.svg'
import { NavigationButton } from '@/components/NavigationButton'
import { useVideoPoster } from '@/hooks/useVideoPoster'

export default function VideoPlayer() {
  const playerRef = useRef<Player>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<IVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const currentVideo = videos[currentVideoIndex]
  const { poster, isLoading: isPosterLoading } = useVideoPoster(
    currentVideo?.src,
    '/images/default-poster.png'
  )

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

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const data = await videoService.getAll()
      setVideos(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index)
    if (playerRef.current) {
      playerRef.current.src([
        {
          src: videos[index].src,
          type: videos[index].type
        }
      ])
    }
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
          <div className='relative w-full group'>
            {loading ? (
              <div className='aspect-video bg-gray-100 dark:bg-[#121214] flex items-center justify-center'>
                <div className='flex flex-col items-center gap-4'>
                  <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
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
                  <button
                    onClick={fetchVideos}
                    className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                  >
                    Refresh
                  </button>
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
                    <VideoJS
                      options={videoJsOptions}
                      onReady={handlePlayerReady}
                    />
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

          {videos[currentVideoIndex]?.description && (
            <div className='py-6'>
              <h2 className='text-xl font-medium text-gray-900 dark:text-white mb-4'>
                Description
              </h2>
              <p className='text-gray-600 dark:text-gray-400'>
                {videos[currentVideoIndex].description}
              </p>
            </div>
          )}
        </div>

        <div className='w-[295px] bg-gray-100 dark:bg-[#121214] py-6 px-3 h-fit'>
          <div className='flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
              <h3 className='text-gray-900 dark:text-white font-medium'>
                Playlist
              </h3>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {videos.length} videos
                </span>
                <button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      await videoService.resetToDefault()
                      await fetchVideos()
                    } catch (err) {
                      console.error('Reset error:', err)
                      setError('Failed to reset videos')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className='p-2 text-sm text-blue-500 hover:text-blue-600 transition-colors'
                  title='Reset to default videos'
                >
                  <svg
                    className='w-4 h-4'
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
                  onClick={() =>
                    currentVideoIndex !== index && handleVideoChange(index)
                  }
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                    currentVideoIndex === index
                      ? 'bg-gray-300 dark:bg-[#29292e]'
                      : 'bg-gray-200 dark:bg-[#202024] hover:bg-gray-300 dark:hover:bg-[#29292e]'
                  }`}
                >
                  {currentVideoIndex === index ? (
                    <Image
                      src={CheckboxSelected}
                      alt='Checkbox selected'
                      width={16}
                      height={16}
                    />
                  ) : (
                    <Image
                      src={CheckboxUnselected}
                      alt='Checkbox unselected'
                      width={16}
                      height={16}
                    />
                  )}
                  <div className='flex justify-between items-center w-full gap-3'>
                    <h4 className='text-gray-900 dark:text-white font-medium text-sm'>
                      {index + 1}. {video.title}
                    </h4>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      {video.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
