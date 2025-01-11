import Link from 'next/link'
import Container from '@/components/Container'

export default function Home() {
  return (
    <Container className='flex-1 flex items-center'>
      <div className='flex flex-col items-center justify-center w-full gap-8 text-center'>
        <p className='text-lg sm:text-xl max-w-2xl text-gray-600 dark:text-gray-100'>
          You are on the Home page of this application. <br />
          To access the Video Player, please use the link below
        </p>

        <Link
          href='/video-player'
          className='px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Go to Video Player
        </Link>
      </div>
    </Container>
  )
}
