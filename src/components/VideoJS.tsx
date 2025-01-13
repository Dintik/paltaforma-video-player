import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import { useWebcamStore } from '@/store/webcamStore'
import 'video.js/dist/video-js.css'

interface VideoJSProps {
  options: typeof videojs.options
  onReady?: (player: Player) => void
  className?: string
}

export const VideoJS = ({ options, onReady, className = '' }: VideoJSProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Player>(null)
  const { stream, isWebcamActive } = useWebcamStore()

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js')
      videoElement.classList.add('vjs-big-play-centered')
      videoRef.current?.appendChild(videoElement)

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready')
        if (onReady) {
          onReady(player)
        }
      }))
    } else {
      const player = playerRef.current

      if (isWebcamActive && stream) {
        // Switch to webcam stream
        try {
          player.controls(false)
          const videoElement = player.tech().el() as HTMLVideoElement
          videoElement.srcObject = stream
        } catch (error) {
          console.error('Error setting webcam stream:', error)
        }
      } else {
        // Switch back to regular video
        const videoElement = player.tech().el() as HTMLVideoElement
        videoElement.srcObject = null
        player.src(options.sources)
        player.poster(options.poster)
        player.controls(true)
      }

      player.autoplay(options.autoplay)
    }
  }, [options, videoRef, onReady, stream, isWebcamActive])

  useEffect(() => {
    const player = playerRef.current

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [playerRef])

  return (
    <div data-vjs-player className={className}>
      <div ref={videoRef} />
    </div>
  )
}
