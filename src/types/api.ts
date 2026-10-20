export type QueryParams = Record<string, string | number | boolean | undefined>

export type Pagination = {
  pageNumber: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
