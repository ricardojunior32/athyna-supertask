import type { Job, JobsQuery, JobsResponse, RawJob, RawJobsResponse } from '../types/job'
import { apiGet } from './client'

export const jobKeys = {
  list: (query: JobsQuery) => ['jobs', 'list', query] as const,
  pages: (query: JobsQuery) => ['jobs', 'pages', query] as const,
  detail: (id: string) => ['jobs', 'detail', id] as const,
  similar: (id: string) => ['jobs', 'similar', id] as const,
}

export const normalizeJob = (raw: RawJob): Job => {
  return {
    ...raw,
    company: { name: 'Unknown company', logoUrl: null, websiteUrl: null, ...raw.company },
    location: { city: null, country: null, locality: null, isRemote: false, ...raw.location },
    experience: { minYears: null, maxYears: null, ...raw.experience },
    skills: Array.isArray(raw.skills) ? raw.skills.filter((skill) => typeof skill === 'string') : [],
  }
}

export const fetchJobs = async (query: JobsQuery, signal?: AbortSignal): Promise<JobsResponse> => {
  const response = await apiGet<RawJobsResponse>('/api/public/jobs', query, signal)
  return { ...response, data: (response.data ?? []).map(normalizeJob) }
}

export const fetchJob = async (id: string, signal?: AbortSignal): Promise<Job> => {
  return normalizeJob(await apiGet<RawJob>(`/api/public/jobs/${encodeURIComponent(id)}`, {}, signal))
}
