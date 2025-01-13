'use client'

import { useState, FormEvent } from 'react'
import Joi from 'joi'
import { useVideoPlayerStore } from '@/store/videoPlayerStore'
import { videoService } from '@/services/api'

const videoSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  src: Joi.string().uri().required().messages({
    'string.uri': 'Enter valid video URL',
    'string.empty': 'Video URL is required',
    'any.required': 'Video URL is required'
  }),
  type: Joi.string().default('video/mp4'),
  duration: Joi.string().max(5).required().messages({
    'string.empty': 'Duration is required',
    'string.max': 'Duration should not exceed 5 characters',
    'any.required': 'Duration is required'
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  })
})

interface FormData {
  title: string
  src: string
  type: string
  duration: string
  description: string
}

const VIDEO_TYPES = [
  { value: 'video/mp4', label: 'MP4' },
  { value: 'video/webm', label: 'WebM' },
  { value: 'video/ogg', label: 'Ogg' }
]

export function AddVideoForm() {
  const { fetchVideos } = useVideoPlayerStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    title: '',
    src: '',
    type: 'video/mp4',
    duration: '',
    description: ''
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const { error } = videoSchema.validate(formData, { abortEarly: false })

    if (error) {
      const validationErrors: Record<string, string> = {}
      error.details.forEach((detail) => {
        if (detail.path[0]) {
          validationErrors[detail.path[0].toString()] = detail.message
        }
      })
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await videoService.create(formData)
      await fetchVideos()
      setFormData({
        title: '',
        src: '',
        type: 'video/mp4',
        duration: '',
        description: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-3 mb-2 pb-5 border-b-2 border-gray-200 dark:border-gray-700'
    >
      <div>
        <input
          name='title'
          value={formData.title}
          onChange={handleChange}
          placeholder='Video title'
          className='w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-[#202024] border-gray-300 dark:border-gray-700 rounded hover:bg-gray-300 dark:hover:bg-[#29292e] focus:bg-gray-300 dark:focus:bg-[#29292e] focus:outline-none'
        />
        {errors.title && (
          <p className='text-red-500 text-sm mt-1'>{errors.title}</p>
        )}
      </div>

      <div>
        <input
          name='src'
          value={formData.src}
          onChange={handleChange}
          placeholder='Video URL'
          className='w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-[#202024] border-gray-300 dark:border-gray-700 rounded hover:bg-gray-300 dark:hover:bg-[#29292e] focus:bg-gray-300 dark:focus:bg-[#29292e] focus:outline-none'
        />
        {errors.src && (
          <p className='text-red-500 text-sm mt-1'>{errors.src}</p>
        )}
      </div>

      <div>
        <input
          name='duration'
          value={formData.duration}
          onChange={handleChange}
          placeholder='Duration (e.g. 02:30)'
          className='w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-[#202024] border-gray-300 dark:border-gray-700 rounded hover:bg-gray-300 dark:hover:bg-[#29292e] focus:bg-gray-300 dark:focus:bg-[#29292e] focus:outline-none'
        />
        {errors.duration && (
          <p className='text-red-500 text-sm mt-1'>{errors.duration}</p>
        )}
      </div>

      <div>
        <select
          name='type'
          value={formData.type}
          onChange={handleChange}
          className='w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-[#202024] border-gray-300 dark:border-gray-700 rounded hover:bg-gray-300 dark:hover:bg-[#29292e] focus:bg-gray-300 dark:focus:bg-[#29292e] focus:outline-none'
        >
          {VIDEO_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Video description'
          className='w-full px-2 py-1 text-sm text-gray-900 dark:text-white bg-gray-200 dark:bg-[#202024] border-gray-300 dark:border-gray-700 rounded hover:bg-gray-300 dark:hover:bg-[#29292e] focus:bg-gray-300 dark:focus:bg-[#29292e] focus:outline-none'
          rows={3}
        />
        {errors.description && (
          <p className='text-red-500 text-sm mt-1'>{errors.description}</p>
        )}
      </div>

      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full p-3 text-sm font-bold text-gray-900 dark:text-white bg-gray-300 dark:bg-[#29292e] rounded-lg hover:bg-gray-400 dark:hover:bg-[#323238] transition-colors disabled:opacity-50'
      >
        {isSubmitting ? 'Adding...' : 'Add video'}
      </button>
    </form>
  )
}
