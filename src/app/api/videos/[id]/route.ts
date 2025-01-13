import { connectToDatabase } from '@/lib/mongodb'
import Video from '@/models/video.model'
import mongoose from 'mongoose'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
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
    
    const video = await Video.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: data }
    )

    if (video.matchedCount === 0) {
      return Response.json({ error: 'Video not found' }, { status: 404 })
    }

    const updatedVideo = await Video.collection.findOne({ 
      _id: new mongoose.Types.ObjectId(id) 
    })
    
    return Response.json(updatedVideo)
  } catch (error) {
    console.error('PUT /videos error:', error)
    return Response.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
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
