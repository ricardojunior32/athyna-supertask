import { API_BASE_URL } from '../config'
import type { QueryParams } from '../types/api'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const apiGet = async <T>(
  path: string,
  params: QueryParams = {},
  signal?: AbortSignal,
): Promise<T> => {
  const url = new URL(path, API_BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }

  const response = await fetch(url, { signal })
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    throw new ApiError(response.status, readMessage(body) ?? response.statusText)
  }
  return (await response.json()) as T
}

const readMessage = (body: unknown): string | undefined => {
  if (body && typeof body === 'object' && 'message' in body) {
    return typeof body.message === 'string' ? body.message : undefined
  }
  return undefined
}
