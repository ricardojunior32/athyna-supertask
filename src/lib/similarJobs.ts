import { fetchJobs } from '../api/jobs'
import { SIMILAR_JOBS_LIMIT } from '../constants/jobs'
import type { Job, JobsQuery } from '../types/job'

const LEVEL_WORDS = /\b(senior|sr|junior|jr|mid[- ]level|entry[- ]level)\b\.?/gi
const TRAILING_LEVEL_OR_ID = /\s+(i{1,3}|iv|v|\S*\d\S*)$/i

export const extractRole = (title: string): string => {
  let role = title
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .split(/\s+[-–\u2014|:]\s+|[,|]|\s{3,}/)[0]
    .replace(LEVEL_WORDS, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  while (TRAILING_LEVEL_OR_ID.test(role)) {
    role = role.replace(TRAILING_LEVEL_OR_ID, '')
  }
  return role
}

export const fetchSimilarJobs = async (
  job: Job,
  signal?: AbortSignal,
  fetchPage: typeof fetchJobs = fetchJobs,
): Promise<Job[]> => {
  const role = extractRole(job.title)
  if (!role) return []

  const sameRole: JobsQuery = {
    q: role,
    pageSize: SIMILAR_JOBS_LIMIT + 1,
    remote: job.location.isRemote || undefined,
  }
  const attempts = job.seniority ? [{ ...sameRole, seniority: job.seniority }, sameRole] : [sameRole]

  const similar = new Map<string, Job>()
  for (const query of attempts) {
    const { data } = await fetchPage(query, signal)
    for (const candidate of data) {
      if (candidate.id !== job.id) similar.set(candidate.id, candidate)
    }
    if (similar.size >= SIMILAR_JOBS_LIMIT) break
  }
  return [...similar.values()].slice(0, SIMILAR_JOBS_LIMIT)
}
