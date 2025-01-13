export interface IVideo {
  _id: string
  title: string
  src: string
  type: string
  duration: string
  description: string
  rating?: number
  createdAt?: Date
  updatedAt?: Date
}
