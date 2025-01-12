'use client'

import Container from '@/components/Container'
import { VideoJS } from '@/components/VideoJS'
import { useRef } from 'react'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'

export default function VideoPlayer() {
  const playerRef = useRef<Player>(null)

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        // src: 'https://videos.pexels.com/video-files/855418/855418-hd_1920_1080_25fps.mp4',
        type: 'video/mp4'
      }
    ]
  }

  const handlePlayerReady = (player: Player) => {
    playerRef.current = player

    player.on('waiting', () => {
      videojs.log('player is waiting')
    })

    player.on('dispose', () => {
      videojs.log('player will dispose')
    })
  }

  return (
    <Container>
      <div className='flex justify-between'>
        <div className='w-[626px] flex flex-col'>
          <div className='relative w-full'>
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </div>

          <div className='py-6'>
            <h2 className='text-xl font-medium text-gray-900 dark:text-white mb-4'>
              Description
            </h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Este curso tem como objetivo te dar os fundamentos da programação
              e entender um pouco mais sobre o web, precisamos desse
              conhecimento para enfim nos tornarmos aptos a estudar as diversas
              linguagens e tecnologias que vamos encontrar como desenvolvedores
              e desenvolvedoras web. Muito bem vamos direto entender os
              fundamentos.
            </p>
          </div>
        </div>

        <div className='w-[295px] bg-gray-100 dark:bg-[#121214] p-6'>
          <div className='mb-6'>
            <h3 className='text-gray-900 dark:text-white font-medium mb-2'>
              Conteúdos
            </h3>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              12 aulas
            </span>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 rounded bg-gray-200 dark:bg-[#202024]'>
              <div className='w-12 h-12 rounded bg-gray-300 dark:bg-[#323238] flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 text-gray-600 dark:text-gray-400'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653Z'
                  />
                </svg>
              </div>
              <div>
                <h4 className='text-gray-900 dark:text-white font-medium'>
                  Tudo geral da curso do
                </h4>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  14:35
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
