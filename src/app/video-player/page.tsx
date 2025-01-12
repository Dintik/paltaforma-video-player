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
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
      setIsInitialLoading(true)
      const data = await videoService.getAll()
      setVideos(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching videos:', err)
      setError('Failed to load videos')
    } finally {
      setIsInitialLoading(false)
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

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete video')
      }

      // Find index of video being deleted
      const deletedVideoIndex = videos.findIndex((video) => video._id === id)

      // Update videos list
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id))

      // Adjust currentVideoIndex
      if (videos.length > 1) {
        if (deletedVideoIndex === currentVideoIndex) {
          // If deleting current video
          if (deletedVideoIndex === videos.length - 1) {
            // If it's the last video, switch to previous one
            setCurrentVideoIndex(currentVideoIndex - 1)
          }
          // If not last, index will stay the same and automatically point to next video
        } else if (deletedVideoIndex < currentVideoIndex) {
          // If deleting video before current one, decrease index
          setCurrentVideoIndex(currentVideoIndex - 1)
        }
      } else {
        // If deleting the last remaining video
        setCurrentVideoIndex(0)
      }
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  return (
    <Container>
      <div className='flex justify-between'>
        <div className='w-[626px] flex flex-col'>
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
                      setIsResetting(true)
                      await videoService.resetToDefault()
                      await fetchVideos()
                    } catch (err) {
                      console.error('Reset error:', err)
                      setError('Failed to reset videos')
                    } finally {
                      setIsResetting(false)
                    }
                  }}
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
                  className={`flex items-center gap-1 p-2 rounded ${
                    currentVideoIndex === index
                      ? 'bg-gray-300 dark:bg-[#29292e]'
                      : 'bg-gray-200 dark:bg-[#202024] hover:bg-gray-300 dark:hover:bg-[#29292e]'
                  }`}
                >
                  <div
                    className='flex-1 flex items-center gap-2 cursor-pointer'
                    onClick={() =>
                      currentVideoIndex !== index && handleVideoChange(index)
                    }
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
                  <button
                    onClick={async () => {
                      setDeletingId(video._id)
                      await handleDeleteVideo(video._id)
                      setDeletingId(null)
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
        </div>
      </div>
    </Container>
  )
}
