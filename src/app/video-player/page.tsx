import Image from "next/image";
import Link from "next/link";

export default function VideoPlayer() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - same as home page */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md sm:px-6 md:px-8">
        <div className="w-10 h-10 bg-gray-200 rounded-full">
          <Image
            src="/placeholder-logo.svg"
            alt="Site logo"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-gray-800 hover:text-gray-600 font-medium"
          >
            Home
          </Link>
          <Link
            href="/video-player"
            className="text-gray-800 hover:text-gray-600 font-medium border-b-2 border-red-500"
          >
            Video Player
          </Link>
        </nav>

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

      {/* Video Player Content */}
      <main className="flex flex-col items-center flex-grow gap-8 p-4 sm:p-6 md:p-8">
        {/* Video player container */}
        <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
          {/* Video placeholder - replace with actual video player component */}
          <div className="w-full h-full flex items-center justify-center text-white">
            Video Player will be here
          </div>
        </div>

        {/* Video controls placeholder */}
        <div className="w-full max-w-4xl flex gap-4 justify-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Play
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Pause
          </button>
        </div>

        {/* Back to home button */}
        <Link
          href="/"
          className="mt-8 px-6 py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Home
        </Link>
      </main>
    </div>
  );
}
