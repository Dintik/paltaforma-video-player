interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export default function Container({
  children,
  className = ''
}: ContainerProps) {
  return (
    <div className={`container mx-auto max-w-[984px] ${className} px-5`}>
      {children}
    </div>
  )
}
