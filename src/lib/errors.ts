import { ApiError } from '../api/client'

export const isNotFound = (error: unknown): boolean => {
  return error instanceof ApiError && (error.status === 404 || error.status === 400)
}

export const describeError = (error: unknown): string => {
  if (error instanceof ApiError && error.status === 429) {
    return 'Too many requests in a short time. Wait a few seconds and try again.'
  }
  if (error instanceof ApiError) {
    return 'Something went wrong on our side. Please try again in a moment.'
  }
  return 'Check your connection and try again.'
}
