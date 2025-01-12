interface NavigationButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
}

export function NavigationButton({
  direction,
  onClick
}: NavigationButtonProps) {
  const isNext = direction === 'next'

  return (
    <button
      onClick={onClick}
      className={`absolute ${isNext ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 z-10 
        p-2 bg-black/50 hover:bg-black/70 ${isNext ? 'rounded-l' : 'rounded-r'} 
        transition-opacity opacity-0 group-hover:opacity-100`}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth={1.5}
        stroke='white'
        className='w-6 h-6'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d={
            isNext ? 'M8.25 4.5l7.5 7.5-7.5 7.5' : 'M15.75 19.5L8.25 12l7.5-7.5'
          }
        />
      </svg>
    </button>
  )
}
