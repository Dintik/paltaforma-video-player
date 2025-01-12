import { create } from 'zustand'
import { IVideo } from '@/types/video.types'
import { videoService } from '@/services/api'

interface VideoState {
  currentVideoIndex: number
  videos: IVideo[]
  isInitialLoading: boolean
  isResetting: boolean
  error: string | null
  deletingId: string | null
}

interface VideoActions {
  setCurrentVideoIndex: (index: number) => void
  fetchVideos: () => Promise<void>
  deleteVideo: (id: string) => Promise<void>
  resetToDefault: () => Promise<void>
}

type VideoStore = VideoState & VideoActions

export const useVideoPlayerStore = create<VideoStore>()((set, get) => ({
  currentVideoIndex: 0,
  videos: [],
  isInitialLoading: true,
  isResetting: false,
  error: null,
  deletingId: null,

  setCurrentVideoIndex: (index) => set({ currentVideoIndex: index }),

  fetchVideos: async () => {
    set({ isInitialLoading: true })
    try {
      const data = await videoService.getAll()
      set({ videos: data, error: null })
    } catch (err) {
      console.error('Error fetching videos:', err)
      set({ error: 'Failed to load videos' })
    } finally {
      set({ isInitialLoading: false })
    }
  },

  deleteVideo: async (id) => {
    set({ deletingId: id })
    try {
      await videoService.delete(id)
      const { videos, currentVideoIndex } = get()
      const deletedVideoIndex = videos.findIndex((video) => video._id === id)
      const newVideos = videos.filter((video) => video._id !== id)
      
      let newIndex = currentVideoIndex
      if (videos.length <= 1) {
        newIndex = 0
      } else if (deletedVideoIndex === currentVideoIndex) {
        if (deletedVideoIndex === videos.length - 1) {
          newIndex = currentVideoIndex - 1
        }
      } else if (deletedVideoIndex < currentVideoIndex) {
        newIndex = currentVideoIndex - 1
      }

      set({ 
        videos: newVideos,
        currentVideoIndex: newIndex,
        deletingId: null 
      })
    } catch (error) {
      console.error('Error deleting video:', error)
      set({ deletingId: null })
    }
  },

  resetToDefault: async () => {
    set({ isResetting: true })
    try {
      await videoService.resetToDefault()
      await get().fetchVideos()
    } catch (err) {
      console.error('Reset error:', err)
      set({ error: 'Failed to reset videos' })
    } finally {
      set({ isResetting: false })
    }
  },
}))
