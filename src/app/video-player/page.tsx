'use client'

import { useEffect } from 'react'
import Container from '@/components/Container'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'
import { Playlist } from '@/components/Playlist/Playlist'
import { VideoPlayer } from '@/components/VideoPlayer'
import { AddVideoForm } from '@/components/AddVideoForm'
import { CameraControls } from '@/components/CameraControls'
import { VideoDescription } from '@/components/VideoDescription'

export default function VideoPlayerPage() {
  const { fetchVideos } = useVideoPlayerStore()
  const { isWebcamActive } = useWebcamStore()

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return (
    <Container>
      <div className='flex flex-col-reverse lg:flex-row justify-between gap-6'>
        <div className='w-full lg:w-[626px] flex flex-col'>
          <CameraControls />
          <VideoPlayer />
          {!isWebcamActive && <VideoDescription />}
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
