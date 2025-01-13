import Link from 'next/link'
import Container from '@/components/Container'

export default function Home() {
  return (
    <Container className='flex-1 flex items-center'>
      <div className='flex flex-col items-center justify-center w-full gap-8 text-center'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Welcome to Video Player App
        </h1>

        <p className='text-lg sm:text-xl max-w-2xl text-gray-600 dark:text-gray-100'>
          You are on the Home page of this application. <br />
          To access the Video Player, please use the link below
        </p>

        <Link
          href='/video-player'
          className='text-sm font-bold px-6 py-3 text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors'
        >
          Go to Video Player
        </Link>
      </div>
    </Container>
  )
}
