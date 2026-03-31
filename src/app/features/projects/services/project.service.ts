import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Project, ProjectFormData } from '../models/project.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les projets
  getAllProjects(filters?: any, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Project>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priorite) params = params.set('priorite', filters.priorite);
    if (filters?.clientId) params = params.set('clientId', filters.clientId);

    return this.http.get<PaginatedResponse<Project>>(this.API_URL, { params });
  }

  // Récupérer un projet par ID
  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Créer un projet
  createProject(data: ProjectFormData): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // Mettre à jour un projet
  updateProject(id: string, data: Partial<ProjectFormData>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // ✅ NOUVELLE MÉTHODE - Changer le statut du projet
  updateProjectStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/status`, { status });
  }

  // Supprimer un projet
  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Assigner une équipe
  assignTeam(id: string, employeeIds: string[]): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/team`, { employeeIds });
  }

  // Ajouter un membre à l'équipe
  addTeamMember(id: string, employeeId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/team/${employeeId}`, {});
  }

  // Retirer un membre de l'équipe
  removeTeamMember(id: string, employeeId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/team/${employeeId}`);
  }

  // Obtenir les stats d'un projet
  getProjectStats(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/stats`);
  }
}
