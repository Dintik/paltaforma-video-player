'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Container from '@/components/Container'
import { VideoJS } from '@/components/VideoJS'
import Player from 'video.js/dist/types/player'
import videojs from 'video.js'
import CheckboxSelected from '@/assets/images/CheckboxSelected.svg'
import CheckboxUnselected from '@/assets/images/CheckboxUnselected.svg'

export default function VideoPlayer() {
  const playerRef = useRef<Player>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  const videos = [
    {
      id: 1,
      title: 'Bavarian Greetings',
      src: 'https://v21-def.ap4r.com/bs2/upload-ylab-stunt-sgp/special-effect/output/e5ff1646-877b-4c5e-b66a-6b337e83a65a/2968088769507078027/out.mp4',
      type: 'video/mp4',
      duration: '01:30',
      description:
        'Experience the charm of traditional Bavarian culture through this delightful greeting sequence. Watch as local customs and warm hospitality come to life in this authentic representation of Alpine traditions.'
    },
    {
      id: 2,
      title: 'Mayah cat dream',
      src: 'https://v15-def.ap4r.com/bs2/upload-ylab-stunt-sgp/special-effect/output/831ec4f8-32a6-478c-bde6-1a8d9eaeccf3/5208871705232948310/out.mp4',
      type: 'video/mp4',
      duration: '00:44',
      description:
        'Enter the whimsical dreamworld of Mayah the cat. This enchanting short follows our feline friend through a surreal adventure filled with imagination and playful moments.'
    },
    {
      id: 3,
      title: 'Surf Rider',
      src: 'https://v15-def.ap4r.com/bs2/upload-ylab-stunt-sgp/special-effect/output/522cdc86-e8c6-4272-8b84-7feb53b99a78/2085849035621127512/out.mp4',
      type: 'video/mp4',
      duration: '01:14',
      description:
        'Catch the perfect wave with this thrilling surfing adventure. Watch as skilled riders navigate the ocean waves, showcasing the grace and excitement of this dynamic water sport.'
    },
    {
      id: 4,
      title: 'Wildlife Music Video (City)',
      src: 'https://v21-def.ap4r.com/bs2/upload-ylab-stunt-sgp/ai_portal/1734115618/XIkN2lAKCO/emusicvideod_1-2.mp4',
      type: 'video/mp4',
      duration: '02:25',
      description:
        'A unique blend of urban landscapes and wildlife imagery set to music. This creative music video explores the unexpected harmony between city life and nature, creating a mesmerizing audio-visual experience.'
    }
  ]

  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: '16:9',
    preload: 'auto',
    sources: [
      {
        src: videos[currentVideoIndex].src,
        type: videos[currentVideoIndex].type
      }
    ]
  }

  const handleVideoChange = (index: number) => {
    setCurrentVideoIndex(index)
    if (playerRef.current) {
      playerRef.current.src([
        {
          src: videos[index].src,
          type: videos[index].type
        }
      ])
    }
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
              {videos[currentVideoIndex].description}
            </p>
          </div>
        </div>

        <div className='w-[295px] bg-gray-100 dark:bg-[#121214] py-6 px-3 h-fit'>
          <div className='flex  justify-between mb-2'>
            <h3 className='text-gray-900 dark:text-white font-medium mb-2'>
              Playlist
            </h3>
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {videos.length} videos
            </span>
          </div>

          <div className='space-y-4'>
            {videos.map((video, index) => (
              <div
                key={index}
                onClick={() =>
                  currentVideoIndex !== index && handleVideoChange(index)
                }
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  currentVideoIndex === index
                    ? 'bg-gray-300 dark:bg-[#29292e]'
                    : 'bg-gray-200 dark:bg-[#202024] hover:bg-gray-300 dark:hover:bg-[#29292e]'
                }`}
              >
                {currentVideoIndex === index ? (
                  <Image
                    src={CheckboxSelected}
                    alt='Checkbox selected'
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image
                    src={CheckboxUnselected}
                    alt='Checkbox unselected'
                    width={16}
                    height={16}
                  />
                )}
                <div className='flex justify-between items-center w-full gap-3'>
                  <h4 className='text-gray-900 dark:text-white font-medium text-sm'>
                    {index + 1}. {video.title}
                  </h4>
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {video.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
