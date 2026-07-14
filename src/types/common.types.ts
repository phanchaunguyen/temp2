// Generic paginated envelope used by /courts, /bookings/me and /payments
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// Standard shape returned by FastAPI's HTTPException(detail=...)
export interface ApiError {
  detail: string;
  status_code?: number;
}
