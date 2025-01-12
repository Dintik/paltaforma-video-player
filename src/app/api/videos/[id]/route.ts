import { connectToDatabase } from '@/lib/mongodb'
import Video from '@/models/video.model'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await context.params
    const video = await Video.findById(id)

    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json(video)
  } catch (error) {
    console.error('Error fetching video:', error)
    return Response.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await context.params
    const data = await request.json()
    const video = await Video.findByIdAndUpdate(id, data, { new: true })

    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json(video)
  } catch (error) {
    console.error('POST /videos error:', error)
    return Response.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await connectToDatabase()
    const { id } = await context.params
    const video = await Video.findByIdAndDelete(id)

    if (!video) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }
    return Response.json({ message: 'Video successfully deleted' })
  } catch (error) {
    console.error('DELETE /videos error:', error)
    return Response.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
