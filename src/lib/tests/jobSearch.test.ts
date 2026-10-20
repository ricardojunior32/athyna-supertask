import { describe, expect, it } from 'vitest'
import { NO_FILTERS } from '../../constants/search'
import { EmploymentType, Seniority } from '../../types/job'
import { Country } from '../../types/location'
import { type JobSearch, SortOption } from '../../types/search'
import { TechSkill } from '../../types/skills'
import { readJobSearch, splitRemoteKeyword, writeJobSearch } from '../jobSearch'

const FULL_SEARCH: JobSearch = {
  q: 'react',
  filters: {
    remote: true,
    locations: [Country.UnitedStates, Country.Canada, Country.Brazil],
    skills: [TechSkill.Python, TechSkill.React],
    seniority: Seniority.Senior,
    employmentType: EmploymentType.Contract,
    minSalary: 50000,
    maxSalary: 90000,
    sort: SortOption.Title,
  },
}

describe('readJobSearch', () => {
  it('returns the defaults for an empty URL', () => {
    expect(readJobSearch(new URLSearchParams())).toEqual({ q: '', filters: NO_FILTERS })
  })

  it('reads every parameter', () => {
    const params = new URLSearchParams(
      'q=react&remote=1&location=north-america,BR&skills=python,REACT&level=SE&type=Contract&minSalary=50000&maxSalary=90000&sort=title',
    )
    expect(readJobSearch(params)).toEqual(FULL_SEARCH)
  })

  it('trims the search text', () => {
    expect(readJobSearch(new URLSearchParams({ q: '  react  ' })).q).toBe('react')
    expect(readJobSearch(new URLSearchParams({ q: '   ' })).q).toBe('')
  })

  it('matches options whatever the casing', () => {
    const { filters } = readJobSearch(new URLSearchParams({ level: 'se', type: 'full time' }))
    expect(filters.seniority).toBe('SE')
    expect(filters.employmentType).toBe('Full Time')
  })

  it('rounds salaries to whole amounts', () => {
    const { filters } = readJobSearch(new URLSearchParams({ minSalary: '49999.5', maxSalary: ' 90000 ' }))
    expect(filters.minSalary).toBe(50000)
    expect(filters.maxSalary).toBe(90000)
  })

  it('ignores values it does not understand', () => {
    const params = new URLSearchParams({
      remote: 'true',
      level: 'XX',
      type: 'Volunteer',
      minSalary: 'abc',
      maxSalary: '-5',
      sort: 'salary',
    })
    expect(readJobSearch(params).filters).toEqual(NO_FILTERS)
    expect(readJobSearch(new URLSearchParams({ minSalary: '0' })).filters.minSalary).toBeNull()
    expect(readJobSearch(new URLSearchParams({ minSalary: '' })).filters.minSalary).toBeNull()
  })
})

describe('writeJobSearch', () => {
  it('leaves the URL empty for the defaults', () => {
    expect(writeJobSearch({ q: '', filters: NO_FILTERS }).toString()).toBe('')
  })

  it('writes every parameter', () => {
    expect(writeJobSearch(FULL_SEARCH).toString()).toBe(
      'q=react&remote=1&location=north-america%2CBR&skills=Python%2CReact&type=Contract&level=SE&minSalary=50000&maxSalary=90000&sort=title',
    )
  })

  it('writes only what differs from the defaults', () => {
    const search = { q: '', filters: { ...NO_FILTERS, remote: true, minSalary: 50000 } }
    expect(writeJobSearch(search).toString()).toBe('remote=1&minSalary=50000')
  })

  it('survives a round trip through the URL', () => {
    expect(readJobSearch(writeJobSearch(FULL_SEARCH))).toEqual(FULL_SEARCH)
    const search = { q: 'c++ & c#', filters: { ...NO_FILTERS, employmentType: EmploymentType.PartTime } }
    expect(readJobSearch(new URLSearchParams(writeJobSearch(search).toString()))).toEqual(search)
  })
})

describe('splitRemoteKeyword', () => {
  it('turns a typed "remote" into the remote filter', () => {
    expect(splitRemoteKeyword('remote')).toEqual({ q: '', remote: true })
    expect(splitRemoteKeyword('Remote')).toEqual({ q: '', remote: true })
  })

  it('keeps the rest of the query', () => {
    expect(splitRemoteKeyword('remote react')).toEqual({ q: 'react', remote: true })
    expect(splitRemoteKeyword('Data Engineer  REMOTE')).toEqual({ q: 'Data Engineer', remote: true })
  })

  it('leaves other queries untouched', () => {
    expect(splitRemoteKeyword('react')).toEqual({ q: 'react', remote: false })
    expect(splitRemoteKeyword('remote-first')).toEqual({ q: 'remote-first', remote: false })
    expect(splitRemoteKeyword('remotely')).toEqual({ q: 'remotely', remote: false })
    expect(splitRemoteKeyword('')).toEqual({ q: '', remote: false })
  })
})
