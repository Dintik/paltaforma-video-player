import { useRef, useCallback } from 'react'
import videojs from 'video.js'
import Player from 'video.js/dist/types/player'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { useWebcamStore } from '@/store/webcamStore'

export const useVideoPlayer = () => {
  const playerRef = useRef<Player>(null)
  const { currentVideoIndex, videos, setCurrentVideoIndex } =
    useVideoPlayerStore()
  const { isWebcamActive, stopWebcam } = useWebcamStore()

  const handlePlayerReady = useCallback(
    (player: Player) => {
      playerRef.current = player

      player.on('waiting', () => {
        videojs.log('player is waiting')
      })

      player.on('dispose', () => {
        videojs.log('player will dispose')
        if (isWebcamActive) {
          stopWebcam()
        }
      })

      player.on('ended', () => {
        if (currentVideoIndex < videos.length - 1) {
          setCurrentVideoIndex(currentVideoIndex + 1)
        }
      })
    },
    [
      currentVideoIndex,
      videos.length,
      isWebcamActive,
      stopWebcam,
      setCurrentVideoIndex
    ]
  )

  return {
    playerRef,
    handlePlayerReady
  }
}
