import { create } from 'zustand'

interface WebcamState {
  isWebcamActive: boolean
  stream: MediaStream | null
  error: string | null
}

interface WebcamActions {
  startWebcam: () => Promise<void>
  stopWebcam: () => void
}

type WebcamStore = WebcamState & WebcamActions

export const useWebcamStore = create<WebcamStore>()((set) => ({
  isWebcamActive: false,
  stream: null,
  error: null,

  startWebcam: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      set({ stream, isWebcamActive: true, error: null })
    } catch (err) {
      console.error('Error accessing webcam:', err)
      set({ error: 'Failed to access webcam' })
    }
  },

  stopWebcam: () => {
    const { stream } = useWebcamStore.getState()
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    set({ stream: null, isWebcamActive: false })
  }
})) 