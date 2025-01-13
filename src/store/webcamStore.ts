import { create } from 'zustand'

interface WebcamState {
  isWebcamActive: boolean
  isRecording: boolean
  stream: MediaStream | null
  mediaRecorder: MediaRecorder | null
  recordedChunks: Blob[]
  error: string | null
}

interface WebcamActions {
  startWebcam: () => Promise<void>
  stopWebcam: () => void
  startRecording: () => void
  stopRecording: () => Promise<string>
  clearRecording: () => void
}

type WebcamStore = WebcamState & WebcamActions

export const useWebcamStore = create<WebcamStore>()((set, get) => ({
  isWebcamActive: false,
  isRecording: false,
  stream: null,
  mediaRecorder: null,
  recordedChunks: [],
  error: null,

  startWebcam: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true // Enable audio for recording
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          set((state) => ({
            recordedChunks: [...state.recordedChunks, event.data]
          }))
        }
      }

      set({
        stream,
        mediaRecorder,
        isWebcamActive: true,
        error: null
      })
    } catch (err) {
      console.error('Error accessing webcam:', err)
      set({ error: 'Failed to access webcam' })
    }
  },

  stopWebcam: () => {
    const { stream, mediaRecorder } = get()
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
    set({
      stream: null,
      mediaRecorder: null,
      isWebcamActive: false,
      isRecording: false,
      recordedChunks: []
    })
  },

  startRecording: () => {
    const { mediaRecorder } = get()
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start(1000) // Collect data every second
      set({ isRecording: true, recordedChunks: [] })
    }
  },

  stopRecording: async () => {
    const { mediaRecorder, recordedChunks } = get()

    if (!mediaRecorder || mediaRecorder.state !== 'recording') {
      throw new Error('No recording in progress')
    }

    return new Promise<string>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        set({ isRecording: false })
        resolve(url)
      }

      mediaRecorder.stop()
    })
  },

  clearRecording: () => {
    set({ recordedChunks: [] })
  }
}))
