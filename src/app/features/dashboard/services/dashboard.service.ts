import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
private readonly API_URL = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  // Récupérer les KPIs
  getKPIs(): Observable<any> {
    return this.http.get(`${this.API_URL}/kpis`);
  }

  // Récupérer les projets récents
  getRecentProjects(limit: number = 5): Observable<any> {
    return this.http.get(`${this.API_URL}/recent-projects`, {
      params: { limit: limit.toString() }
    });
  }

  // Récupérer les tâches urgentes
  getUrgentTasks(limit: number = 10): Observable<any> {
    return this.http.get(`${this.API_URL}/urgent-tasks`, {
      params: { limit: limit.toString() }
    });
  }

  // Récupérer les tâches par priorité
  getTasksByPriority(): Observable<any> {
    return this.http.get(`${this.API_URL}/charts/tasks-priority`);
  }

  // Récupérer les tâches par statut
  getTasksByStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/charts/tasks-status`);
  }

  // Récupérer les projets par statut
  getProjectsByStatus(): Observable<any> {
    return this.http.get(`${this.API_URL}/charts/projects-status`);
  }

  // Récupérer les activités
  getActivityChart(): Observable<any> {
    return this.http.get(`${this.API_URL}/charts/activity`);
  }

  // Récupérer la charge de travail des employés
  getEmployeeWorkload(): Observable<any> {
    return this.http.get(`${this.API_URL}/charts/employee-workload`);
  }

  // Récupérer les top clients
  getTopClients(limit: number = 5): Observable<any> {
    return this.http.get(`${this.API_URL}/top-clients`, {
      params: { limit: limit.toString() }
    });
  }

  // Récupérer les projets à risque
  getRiskProjects(): Observable<any> {
    return this.http.get(`${this.API_URL}/alerts/risk-projects`);
  }

  // Récupérer les projets en retard
  getOverdueProjects(): Observable<any> {
    return this.http.get(`${this.API_URL}/alerts/overdue-projects`);
  }

  // Récupérer le dashboard complet
  getFullDashboard(): Observable<any> {
    return this.http.get(`${this.API_URL}/full`);
  }
}
