import api from '@/utils/axios';
import { IVideo } from '@/types/video.types';

export const videoService = {
  async getAll() {
    const { data } = await api.get<IVideo[]>('/videos');
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<IVideo>(`/videos/${id}`);
    return data;
  },

  async create(video: Omit<IVideo, '_id'>) {
    const { data } = await api.post<IVideo>('/videos', video);
    return data;
  },

  async update(id: string, video: Partial<IVideo>) {
    const { data } = await api.put<IVideo>(`/videos/${id}`, video);
    return data;
  },

  async delete(id: string) {
    await api.delete(`/videos/${id}`);
  },

  async resetToDefault() {
    const { data } = await api.post('/videos/reset');
    return data;
  }
}; 