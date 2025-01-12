import { connectToDatabase } from '@/lib/mongodb';
import Video from '@/models/video.model';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(video);
  } catch (error) {
    console.error('GET /videos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const video = await Video.findByIdAndUpdate(params.id, data, { new: true });
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(video);
  } catch (error) {
    console.error('POST /videos error:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const video = await Video.findByIdAndDelete(params.id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Video successfully deleted' });
  } catch (error) {
    console.error('DELETE /videos error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
} 