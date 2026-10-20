import { useQuery } from '@tanstack/react-query'
import { fetchJob, jobKeys } from '../api/jobs'

export const useJob = (id: string) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: ({ signal }) => fetchJob(id, signal),
  })
}
