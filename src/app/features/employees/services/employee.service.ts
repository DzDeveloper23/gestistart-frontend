import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Employee, EmployeeFormData } from '../models/employee.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les employés
  getAllEmployees(filters?: any, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Employee>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.role) params = params.set('role', filters.role);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<PaginatedResponse<Employee>>(this.API_URL, { params }).pipe(
      catchError(error => {
        // ✅ Si c'est un 403, on ne log pas l'erreur
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
          // Retourner une réponse vide au lieu d'une erreur
          return throwError(() => error);
        }
        // Pour les autres erreurs, on les laisse passer
        return throwError(() => error);
      })
    );
  }

  // Récupérer un employé par ID
  getEmployeeById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Créer un employé
  createEmployee(data: EmployeeFormData): Observable<any> {
    return this.http.post(this.API_URL, data).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Mettre à jour un employé
  updateEmployee(id: string, data: Partial<EmployeeFormData>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Supprimer un employé
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Changer le statut d'un employé
  updateEmployeeStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/status`, { status }).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Obtenir les tâches d'un employé
  getEmployeeTasks(id: string, status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get(`${this.API_URL}/${id}/tasks`, { params }).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Obtenir les projets d'un employé
  getEmployeeProjects(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/projects`).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }

  // Obtenir les stats d'un employé
  getEmployeeStats(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/stats`).pipe(
      catchError(error => {
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé (permission insuffisante)');
        }
        return throwError(() => error);
      })
    );
  }
}
