import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sm:px-6 md:px-8">
        {/* Logo placeholder */}
        <div className="w-10 h-10 bg-gray-200 rounded-full">
          <Image
            src="/placeholder-logo.svg"
            alt="Site logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        {/* Navigation */}
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 font-medium border-b-2 border-red-500"
          >
            Home
          </Link>
          <Link
            href="/video-player"
            className="text-gray-800 hover:text-gray-600 font-medium"
          >
            Video Player
          </Link>
        </nav>

        {/* User avatar */}
        <div className="w-8 h-8 bg-gray-200 rounded-full">
          <Image
            src="/placeholder-avatar.svg"
            alt="User avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow gap-8 px-4 py-12 text-center">
        <p className="text-lg sm:text-xl max-w-2xl">
          You are on the home page of this application. To access the Video
          Player, please use the link below
        </p>

        <Link
          href="/video-player"
          className="px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Video Player
        </Link>
      </main>
    </div>
  );
}
