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
              <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded' />
              <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full' />
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

            <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full'>
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
