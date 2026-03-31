import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-client-create',
  standalone: false,
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent {
   isLoading = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private notification: NotificationService
  ) {}

  onSubmit(formData: any): void {
    this.isLoading = true;

    this.clientService.createClient(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Client créé avec succès');
          this.router.navigate(['/clients', response.client._id]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating client:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
