import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-edit',
  standalone: false,
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent  implements OnInit{
   client: Client | null = null;
  isLoading = false;
  isLoadingClient = true;

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
    }
  }

  loadClient(id: string): void {
    this.isLoadingClient = true;
    this.clientService.getClientById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.client = response.client;
        }
        this.isLoadingClient = false;
      },
      error: (error) => {
        console.error('Error loading client:', error);
        this.isLoadingClient = false;
        this.router.navigate(['/clients']);
      }
    });
  }

  onSubmit(formData: any): void {
    if (!this.client) return;

    this.isLoading = true;

    this.clientService.updateClient(this.client._id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Client mis à jour avec succès');
          this.router.navigate(['/clients', this.client!._id]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating client:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.client) {
      this.router.navigate(['/clients', this.client._id]);
    } else {
      this.router.navigate(['/clients']);
    }
  }
}
