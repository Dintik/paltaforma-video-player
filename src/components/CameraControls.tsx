import { useWebcamStore } from '@/store/webcamStore'

export function CameraControls() {
  const {
    isWebcamActive,
    startWebcam,
    stopWebcam,
    isRecording,
    startRecording,
    stopRecording,
    clearRecording
  } = useWebcamStore()

  const handleWebcamToggle = async () => {
    if (isWebcamActive) {
      stopWebcam()
    } else {
      await startWebcam()
    }
  }

  const handleRecordingToggle = async () => {
    if (isRecording) {
      try {
        const videoUrl = await stopRecording()

        const shouldSave = window.confirm('Save recording?')

        if (shouldSave) {
          const downloadLink = document.createElement('a')
          downloadLink.href = videoUrl

          const date = new Date()
          const timestamp = date.toISOString().replace(/[:.]/g, '-')
          downloadLink.download = `webcam-recording-${timestamp}.webm`

          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        } else {
          clearRecording()
        }

        URL.revokeObjectURL(videoUrl)
      } catch (error) {
        console.error('Failed to stop recording:', error)
      }
    } else {
      startRecording()
    }
  }

  return (
    <div className='flex gap-3 mb-4'>
      <button
        onClick={handleWebcamToggle}
        className='px-4 py-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors'
      >
        {isWebcamActive ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
      {isWebcamActive && (
        <button
          onClick={handleRecordingToggle}
          className='px-4 py-2 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors'
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      )}
    </div>
  )
}
