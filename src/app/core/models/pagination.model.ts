export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];           // ✅ Ajouté optionnel
  tasks?: T[];          // ✅ Ajouté pour compatibilité avec TaskService
  projects?: T[];       // ✅ Ajouté pour compatibilité avec d'autres services
  pagination?: Pagination;  // ✅ Rendu optionnel
}
