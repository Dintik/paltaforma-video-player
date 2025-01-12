import { useState, useCallback } from 'react'
import { IVideo } from '@/types/video.types'
import { videoService } from '@/services/api'

export const useVideoPlayer = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videos, setVideos] = useState<IVideo[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchVideos = useCallback(async () => {
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
  }, [])

  const handleDeleteVideo = async (id: string) => {
    try {
      setDeletingId(id)
      const response = await fetch(`/api/videos/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete video')

      const deletedVideoIndex = videos.findIndex((video) => video._id === id)
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id))

      updateCurrentIndexAfterDelete(deletedVideoIndex)
    } catch (error) {
      console.error('Error deleting video:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const updateCurrentIndexAfterDelete = (deletedVideoIndex: number) => {
    if (videos.length <= 1) {
      setCurrentVideoIndex(0)
      return
    }

    if (deletedVideoIndex === currentVideoIndex) {
      if (deletedVideoIndex === videos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex - 1)
      }
    } else if (deletedVideoIndex < currentVideoIndex) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const resetToDefault = async () => {
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
  }

  return {
    currentVideoIndex,
    setCurrentVideoIndex,
    videos,
    isInitialLoading,
    isResetting,
    error,
    deletingId,
    setDeletingId,
    fetchVideos,
    handleDeleteVideo,
    resetToDefault
  }
}
