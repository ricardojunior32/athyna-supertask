import { describe, expect, it, vi } from 'vitest'
import { normalizeJob } from '../../api/jobs'
import { SIMILAR_JOBS_LIMIT } from '../../constants/jobs'
import type { Job, JobsQuery, JobsResponse } from '../../types/job'
import { extractRole, fetchSimilarJobs } from '../similarJobs'

const makeJob = (id: string, overrides: Partial<Job> = {}): Job => {
  return {
    ...normalizeJob({
      id,
      slug: id,
      title: 'Senior Software Engineer',
      url: `https://example.com/jobs/${id}`,
      applicationUrl: null,
      employmentType: null,
      seniority: null,
      category: null,
      salary: null,
      overview: null,
      description: null,
      publishedAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    }),
    ...overrides,
  }
}

const makeJobs = (...ids: string[]): Job[] => {
  return ids.map((id) => makeJob(id))
}

const fetcherReturning = (...pages: Job[][]) => {
  const fetchPage = vi.fn(async (_query: JobsQuery, _signal?: AbortSignal): Promise<JobsResponse> => {
    const data = pages.shift() ?? []
    return {
      data,
      pagination: {
        pageNumber: 1,
        pageSize: data.length,
        totalItems: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  })
  return fetchPage
}

describe('fetchSimilarJobs', () => {
  it('searches the role with the same seniority first and stops when that fills the list', async () => {
    const job = makeJob('current', { seniority: 'SE' })
    const fetchPage = fetcherReturning(makeJobs('a', 'b', 'c', 'd'))

    const similar = await fetchSimilarJobs(job, undefined, fetchPage)

    expect(similar.map((item) => item.id)).toEqual(['a', 'b', 'c', 'd'])
    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(fetchPage.mock.calls[0][0]).toEqual({
      q: 'Software Engineer',
      pageSize: SIMILAR_JOBS_LIMIT + 1,
      seniority: 'SE',
    })
  })

  it('falls back to any seniority when the first search comes up short', async () => {
    const job = makeJob('current', { seniority: 'SE' })
    const fetchPage = fetcherReturning(makeJobs('a'), makeJobs('b', 'c'))

    const similar = await fetchSimilarJobs(job, undefined, fetchPage)

    expect(similar.map((item) => item.id)).toEqual(['a', 'b', 'c'])
    expect(fetchPage).toHaveBeenCalledTimes(2)
    expect(fetchPage.mock.calls[1][0]).not.toHaveProperty('seniority')
  })

  it('searches once when the job has no seniority', async () => {
    const fetchPage = fetcherReturning(makeJobs('a'))

    await fetchSimilarJobs(makeJob('current'), undefined, fetchPage)

    expect(fetchPage).toHaveBeenCalledTimes(1)
    expect(fetchPage.mock.calls[0][0]).not.toHaveProperty('seniority')
  })

  it('leaves out the job itself and repeated results', async () => {
    const job = makeJob('current', { seniority: 'SE' })
    const fetchPage = fetcherReturning(makeJobs('current', 'a'), makeJobs('a', 'current', 'b'))

    const similar = await fetchSimilarJobs(job, undefined, fetchPage)

    expect(similar.map((item) => item.id)).toEqual(['a', 'b'])
  })

  it('never returns more than the limit', async () => {
    const job = makeJob('current', { seniority: 'SE' })
    const fetchPage = fetcherReturning(makeJobs('a', 'b', 'c'), makeJobs('d', 'e', 'f'))

    const similar = await fetchSimilarJobs(job, undefined, fetchPage)

    expect(similar.map((item) => item.id)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('keeps the search remote only for a remote job', async () => {
    const location = { city: null, country: null, locality: null, isRemote: true }
    const fetchPage = fetcherReturning([], [])

    await fetchSimilarJobs(makeJob('remote', { location }), undefined, fetchPage)
    await fetchSimilarJobs(makeJob('onsite'), undefined, fetchPage)

    expect(fetchPage.mock.calls[0][0].remote).toBe(true)
    expect(fetchPage.mock.calls[1][0].remote).toBeUndefined()
  })

  it('does not search when the title has no role', async () => {
    const fetchPage = fetcherReturning()

    expect(await fetchSimilarJobs(makeJob('current', { title: 'Senior' }), undefined, fetchPage)).toEqual([])
    expect(fetchPage).not.toHaveBeenCalled()
  })
})

describe('normalizeJob', () => {
  it('fills in the fields the UI reads without checking', () => {
    const job = normalizeJob({ ...makeJob('a'), skills: null, company: null, location: null, experience: null })

    expect(job.skills).toEqual([])
    expect(job.company).toEqual({ name: 'Unknown company', logoUrl: null, websiteUrl: null })
    expect(job.location).toEqual({ city: null, country: null, locality: null, isRemote: false })
    expect(job.experience).toEqual({ minYears: null, maxYears: null })
  })

  it('keeps what the API did send', () => {
    const company = { name: 'Acme', logoUrl: null, websiteUrl: null }

    expect(normalizeJob({ ...makeJob('a'), company, skills: ['React'] })).toMatchObject({
      company,
      skills: ['React'],
    })
  })
})

describe('extractRole', () => {
  it('keeps a plain title as is', () => {
    expect(extractRole('Software Engineer')).toBe('Software Engineer')
    expect(extractRole('Full-Stack Developer')).toBe('Full-Stack Developer')
  })

  it('drops seniority words', () => {
    expect(extractRole('Senior Software Engineer')).toBe('Software Engineer')
    expect(extractRole('Sr. Backend Developer')).toBe('Backend Developer')
    expect(extractRole('JUNIOR Data Analyst')).toBe('Data Analyst')
    expect(extractRole('Mid-Level Designer')).toBe('Designer')
    expect(extractRole('Entry Level Accountant')).toBe('Accountant')
  })

  it('drops whatever sits in parentheses or brackets', () => {
    expect(extractRole('Data Analyst (Remote)')).toBe('Data Analyst')
    expect(extractRole('[Hiring] Junior QA Engineer')).toBe('QA Engineer')
  })

  it('keeps only what comes before a separator', () => {
    expect(extractRole('Product Manager - Growth')).toBe('Product Manager')
    expect(extractRole('Product Manager – Growth')).toBe('Product Manager')
    expect(extractRole('Frontend Developer, React')).toBe('Frontend Developer')
    expect(extractRole('QA Engineer | Remote')).toBe('QA Engineer')
  })

  it('does not split on a hyphen or colon inside a phrase', () => {
    expect(extractRole('Front-End Developer')).toBe('Front-End Developer')
    expect(extractRole('Account Executive: Enterprise')).toBe('Account Executive: Enterprise')
  })

  it('drops trailing levels and requisition ids', () => {
    expect(extractRole('Software Engineer II')).toBe('Software Engineer')
    expect(extractRole('Software Engineer 3')).toBe('Software Engineer')
    expect(extractRole('Registered Nurse R12345')).toBe('Registered Nurse')
    expect(extractRole('Engineer III 2024')).toBe('Engineer')
  })

  it('returns nothing when the title is only a level', () => {
    expect(extractRole('Senior')).toBe('')
    expect(extractRole('')).toBe('')
  })
})
