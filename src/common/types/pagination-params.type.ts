export interface PaginationParamsType {
  page?: number
  limit?: number
  orderBy?: Record<string, 'asc' | 'desc'>
}
