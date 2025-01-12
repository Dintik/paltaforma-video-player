import { connectToDatabase } from '@/lib/mongodb'
import Video from '@/models/video.model'
import { NextResponse } from 'next/server'
import defaultVideosData from '@/data/default-videos.json'

export async function POST() {
  try {
    await connectToDatabase()
    await Video.deleteMany({}) // Delete all videos
    await Video.insertMany(defaultVideosData.videos) // Add default videos
    return NextResponse.json({ message: 'Database reset successfully' })
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    )
  }
}
