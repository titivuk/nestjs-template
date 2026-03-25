/**
 * Wrapper around paginated data
 */
export type PaginatedResult<T = unknown> = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
};
