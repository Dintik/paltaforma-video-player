import { IVideo } from '@/types/video.types'

export const getVideoJsOptions = (
  currentVideo: IVideo | undefined,
  poster: string | undefined
) => ({
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  aspectRatio: '16:9',
  preload: 'auto',
  poster: poster || '/images/default-poster.png',
  controlBar: {
    skipButtons: {
      backward: 10,
      forward: 10
    }
  },
  sources: currentVideo
    ? [
        {
          src: currentVideo.src,
          type: currentVideo.type
        }
      ]
    : []
})
