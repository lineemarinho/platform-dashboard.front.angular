export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
}
