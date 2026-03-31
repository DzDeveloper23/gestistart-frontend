import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: false,
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  clientProjects: any[] = [];
  clientStats: any = null;
  isLoading = true;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.loadClient(clientId);
      this.loadClientProjects(clientId);
      this.loadClientStats(clientId);
    }
  }

  loadClient(id: string): void {
    this.isLoading = true;
    this.clientService.getClientById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.client = response.client;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading client:', error);
        this.isLoading = false;
        this.router.navigate(['/clients']);
      }
    });
  }

  loadClientProjects(id: string): void {
    this.clientService.getClientProjects(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientProjects = response.projects || [];
        }
      },
      error: (error) => {
        console.error('Error loading client projects:', error);
      }
    });
  }

  loadClientStats(id: string): void {
    this.clientService.getClientStats(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientStats = response.stats;
        }
      },
      error: (error) => {
        console.error('Error loading client stats:', error);
      }
    });
  }

  editClient(): void {
    if (this.client) {
      this.router.navigate(['/clients', this.client._id, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  deleteClient(): void {
    if (!this.client) return;

    this.clientService.deleteClient(this.client._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Client supprimé avec succès');
          this.router.navigate(['/clients']);
        }
      },
      error: (error) => {
        console.error('Error deleting client:', error);
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
