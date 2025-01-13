import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navigation = () => {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/video-player', label: 'Video Player' }
  ]

  return (
    <nav className='flex gap-6'>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 font-medium ${
            pathname === href ? 'border-b-2 border-red-500' : ''
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
