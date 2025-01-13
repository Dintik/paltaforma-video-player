'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import AvatarIcon from '@/assets/images/Avatar.svg'
import LogoIcon from '@/assets/images/Logo.svg'
import Container from './Container'

export default function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='bg-white dark:bg-gray-800 shadow-md'>
        <Container>
          <header className='flex items-center justify-between h-16'>
            <div className='w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full' />
            <nav className='flex gap-6'>
              <span className='w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded' />
              <span className='w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded' />
            </nav>
            <div className='flex items-center gap-4'>
              <div className='w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded' />
              <div className='w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded' />
              <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full hidden sm:block' />
            </div>
          </header>
        </Container>
      </div>
    )
  }

  return (
    <div className='bg-white dark:bg-gray-800 shadow-md'>
      <Container>
        <header className='flex items-center justify-between h-16'>
          <Link
            href='/'
            className='w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full'
          >
            <Image
              src={LogoIcon}
              alt='Site logo'
              width={40}
              height={40}
              className='rounded-full'
            />
          </Link>

          <nav className='flex gap-6'>
            <Link
              href='/'
              className={`text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 font-medium ${
                pathname === '/' ? 'border-b-2 border-red-500' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href='/video-player'
              className={`text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 font-medium ${
                pathname === '/video-player' ? 'border-b-2 border-red-500' : ''
              }`}
            >
              Video Player
            </Link>
          </nav>

          <div className='flex items-center gap-4'>
            <a
              href='https://github.com/Dintik/paltaforma-video-player'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              aria-label='View source on GitHub'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-5 h-5'
              >
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
            </a>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
              aria-label={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {theme === 'dark' ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z'
                  />
                </svg>
              )}
            </button>

            <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full hidden sm:block'>
              <Image
                src={AvatarIcon}
                alt='User avatar'
                width={32}
                height={32}
                className='rounded-full'
              />
            </div>
          </div>
        </header>
      </Container>
    </div>
  )
}
