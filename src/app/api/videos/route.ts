import { connectToDatabase } from '@/lib/mongodb'
import Video from '@/models/video.model'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()
    const videos = await Video.find({}).sort({ createdAt: -1 })
    return NextResponse.json(videos)
  } catch (error) {
    console.error('GET /videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const data = await request.json()
    const video = await Video.create(data)
    return NextResponse.json(video)
  } catch (error) {
    console.error('POST /videos error:', error)
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    )
  }
}
