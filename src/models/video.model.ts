import mongoose from 'mongoose';
import { IVideo } from '@/types/video.types';

const VideoSchema = new mongoose.Schema<IVideo>({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  src: {
    type: String,
    required: [true, 'Video URL is required']
  },
  type: {
    type: String,
    required: [true, 'Video type is required'],
    default: 'video/mp4'
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  }
}, {
  timestamps: true
});

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema); 