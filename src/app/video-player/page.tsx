'use client'

import { useEffect } from 'react'
import Container from '@/components/Container'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'
import { Playlist } from '@/components/Playlist'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AddVideoForm } from '@/components/AddVideoForm'
import { VideoRating } from '@/components/VideoRating'
import { CameraControls } from '@/components/CameraControls'

export default function VideoPlayerPage() {
  const { currentVideoIndex, videos, fetchVideos } = useVideoPlayerStore()
  const { isWebcamActive } = useWebcamStore()

  const currentVideo = videos[currentVideoIndex]

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return (
    <Container>
      <div className='flex flex-col-reverse lg:flex-row justify-between gap-6'>
        <div className='w-full lg:w-[626px] flex flex-col'>
          <CameraControls />
          <VideoPlayer />

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
