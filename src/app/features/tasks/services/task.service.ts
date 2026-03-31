import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, TaskFormData } from '../models/task.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // Récupérer toutes les tâches
  getAllTasks(filters?: any, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Task>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.projectId) params = params.set('projectId', filters.projectId);
    if (filters?.assigneId) params = params.set('assigneId', filters.assigneId);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priorite) params = params.set('priorite', filters.priorite);

    return this.http.get<PaginatedResponse<Task>>(this.API_URL, { params });
  }

  // Récupérer une tâche par ID
  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Créer une tâche
  createTask(data: TaskFormData): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // Mettre à jour une tâche
  updateTask(id: string, data: Partial<TaskFormData>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // Supprimer une tâche
  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Changer le statut d'une tâche
  updateTaskStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/status`, { status });
  }

  // Ajouter un commentaire
  addComment(id: string, texte: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/comments`, { texte });
  }

  // Supprimer un commentaire
  deleteComment(id: string, commentId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/comments/${commentId}`);
  }

  // Assigner une tâche
  assignTask(id: string, employeeId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/assign`, { employeeId });
  }

  // Retirer l'assignation
  unassignTask(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/assign`);
  }

  // Ajouter une pièce jointe
  addAttachment(id: string, nom: string, url: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/attachments`, { nom, url });
  }

  // Retirer une pièce jointe
  removeAttachment(id: string, attachmentId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}/attachments/${attachmentId}`);
  }

  // Vue Kanban
  getKanbanView(projectId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/project/${projectId}/kanban`);
  }

  // Stats des tâches
  getTaskStats(projectId: string): Observable<any> {
    return this.http.get(`${this.API_URL}/project/${projectId}/stats`);
  }
}
