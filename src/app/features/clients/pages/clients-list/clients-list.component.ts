import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Client } from '../../models/client.model';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-clients-list',
  standalone: false,
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  limit = 9;

  // Filters
  selectedStatus = '';
  searchQuery = '';

  // Confirmation modal
  showDeleteModal = false;
  clientToDelete: string | null = null;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NotificationService,
    private sharedService: SharedService    
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;

    const filters: any = {};
    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.searchQuery) filters.search = this.searchQuery;

    this.clientService.getAllClients(filters, this.currentPage, this.limit).subscribe({
      next: (response) => {
        if (response.success) {
          this.clients = response.data || [];
          this.totalPages = response.pagination?.pages || 1;

          // 🔥 Mise à jour du badge en temps réel
          this.sharedService.updateClientsCount(this.clients.length);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.isLoading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadClients();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadClients();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadClients();
  }

  viewClient(clientId: string): void {
    this.router.navigate(['/clients', clientId]);
  }

  editClient(clientId: string): void {
    this.router.navigate(['/clients', clientId, 'edit']);
  }

  confirmDelete(clientId: string): void {
    this.clientToDelete = clientId;
    this.showDeleteModal = true;
  }

  deleteClient(): void {
    if (!this.clientToDelete) return;

    this.clientService.deleteClient(this.clientToDelete).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Client supprimé avec succès');
          this.showDeleteModal = false;
          this.clientToDelete = null;

          // Recharge et mettra badge à jour automatiquement
          this.loadClients();
        }
      },
      error: (error) => {
        console.error('Error deleting client:', error);
        this.showDeleteModal = false;
        this.clientToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  createClient(): void {
    this.router.navigate(['/clients/create']);
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.searchQuery = '';
    this.onFilterChange();
  }
}
