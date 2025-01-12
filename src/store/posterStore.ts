import { create } from 'zustand'

interface PosterState {
  posters: Record<string, string>
  loadingUrls: string[]
  errors: Record<string, string | null>
}

interface PosterActions {
  generatePoster: (videoUrl: string) => Promise<void>
  isLoading: (videoUrl: string) => boolean
  getError: (videoUrl: string) => string | null | undefined
}

type PosterStore = PosterState & PosterActions

export const usePosterStore = create<PosterStore>()((set, get) => ({
  posters: {},
  loadingUrls: [],
  errors: {},

  isLoading: (videoUrl) => get().loadingUrls.includes(videoUrl),
  getError: (videoUrl) => get().errors[videoUrl],

  generatePoster: async (videoUrl) => {
    if (!videoUrl) {
      console.log('No video URL provided')
      return
    }

    const existingPoster = get().posters[videoUrl]
    if (existingPoster) {
      return
    }

    set((state) => ({
      loadingUrls: [...state.loadingUrls, videoUrl],
      errors: { ...state.errors, [videoUrl]: null }
    }))

    try {
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Video loading timeout'))
        }, 3000) // 3 second timeout

        video.onloadedmetadata = () => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            reject(new Error('Invalid video dimensions'))
            return
          }
          video.currentTime = 1
        }

        video.onseeked = () => {
          try {
            clearTimeout(timeoutId)

            const canvas = document.createElement('canvas')
            const maxSize = 720
            const scale = Math.min(
              1,
              maxSize / Math.max(video.videoWidth, video.videoHeight)
            )

            canvas.width = Math.round(video.videoWidth * scale)
            canvas.height = Math.round(video.videoHeight * scale)

            const ctx = canvas.getContext('2d', {
              alpha: false, // Turn off transparency for better quality
              willReadFrequently: false // Optimize for single render
            })

            if (!ctx) {
              throw new Error('Failed to get canvas context')
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const posterUrl = canvas.toDataURL('image/jpeg', 0.85)

            set((state) => ({
              posters: { ...state.posters, [videoUrl]: posterUrl }
            }))
            resolve(posterUrl)
          } catch (err) {
            console.error('Error in poster generation:', err)
            reject(err)
          } finally {
            video.remove()
          }
        }

        video.onerror = () => {
          clearTimeout(timeoutId)
          reject(
            new Error(
              `Failed to load video: ${video.error?.message || 'unknown error'}`
            )
          )
        }

        video.onabort = () => {
          clearTimeout(timeoutId)
          reject(new Error('Video loading aborted'))
        }

        video.src = videoUrl
        video.load()
      })
    } catch (err) {
      console.error('Poster generation error:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate poster'

      set((state) => ({
        errors: { ...state.errors, [videoUrl]: errorMessage },
        posters: state.posters
      }))
    } finally {
      set((state) => ({
        loadingUrls: state.loadingUrls.filter((url) => url !== videoUrl)
      }))
    }
  }
}))
