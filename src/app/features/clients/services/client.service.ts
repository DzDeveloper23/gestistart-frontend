import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Client, ClientFormData } from '../models/client.model';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  // Récupérer tous les clients
  getAllClients(filters?: any, page: number = 1, limit: number = 10): Observable<PaginatedResponse<Client>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<PaginatedResponse<Client>>(this.API_URL, { params });
  }

  // Récupérer un client par ID
  getClientById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // Créer un client
  createClient(data: ClientFormData): Observable<any> {
    return this.http.post(this.API_URL, data);
  }

  // Mettre à jour un client
  updateClient(id: string, data: Partial<ClientFormData>): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // Supprimer un client
  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  // Obtenir les projets d'un client
  getClientProjects(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/projects`);
  }

  // Obtenir les stats d'un client
  getClientStats(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}/stats`);
  }

  // Changer le statut d'un client
  updateClientStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/${id}/status`, { status });
  }
}
