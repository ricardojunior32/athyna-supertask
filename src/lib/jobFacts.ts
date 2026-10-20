import { Banknote, Clock, MapPin, TrendingUp } from 'lucide-react'
import type { Job, JobFact } from '../types/job'
import { formatEmploymentType, formatLocation, formatSalary, formatSeniority } from './format'

export const getJobFacts = (job: Job): JobFact[] => {
  return [
    {
      label: 'Location',
      value: formatLocation(job.location),
      icon: MapPin,
      highlight: job.location.isRemote,
    },
    { label: 'Employment', value: formatEmploymentType(job.employmentType), icon: Clock },
    { label: 'Experience', value: formatSeniority(job.seniority), icon: TrendingUp },
    { label: 'Salary', value: formatSalary(job.salary), icon: Banknote },
  ]
}
