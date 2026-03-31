import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-employee-create',
  standalone: false,
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss'
})
export class EmployeeCreateComponent implements OnInit {
  isLoading = false;
  users: any[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('🚀 Chargement des utilisateurs...');

    // Récupérer le token du localStorage
    const token = localStorage.getItem('accessToken');
    console.log('🔐 Token trouvé?', !!token);

    if (!token) {
      console.error('❌ Pas de token trouvé! Redirection vers login');
      this.notification.error('Session expirée, veuillez vous reconnecter');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Créer les headers avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Essayer l'endpoint sans-employee
    this.http.get<any>(`${environment.apiUrl}/auth/users/without-employee`, { headers })
      .subscribe({
        next: (response) => {
          console.log('✅ Utilisateurs chargés (sans-employee):', response);
          if (response.success && response.users) {
            this.users = response.users;
            console.log('✅ ' + this.users.length + ' utilisateurs disponibles');
          } else if (Array.isArray(response.users)) {
            this.users = response.users;
          }
        },
        error: (error) => {
          console.warn('⚠️ Erreur sans-employee:', error.status, error.statusText);
          console.warn('Réponse:', error.error);

          // Fallback : charger TOUS les utilisateurs si l'endpoint spécifique échoue
          console.log('↪️ Fallback: chargement de tous les utilisateurs...');

          this.http.get<any>(`${environment.apiUrl}/auth/users`, { headers })
            .subscribe({
              next: (response) => {
                console.log('✅ Utilisateurs chargés (fallback):', response);
                if (response.success && response.users) {
                  this.users = response.users;
                } else if (Array.isArray(response.users)) {
                  this.users = response.users;
                } else if (Array.isArray(response)) {
                  this.users = response;
                }
                console.log('✅ ' + this.users.length + ' utilisateurs disponibles');
              },
              error: (fallbackError) => {
                console.error('❌ Erreur fallback:', fallbackError.status, fallbackError.statusText);
                this.notification.warning('Impossible de charger la liste des utilisateurs');
                this.users = [];
              }
            });
        }
      });
  }

  onSubmit(formData: any): void {
    console.log('🔥🔥🔥 CREATION - onSubmit() APPELÉ 🔥🔥🔥');
    console.log('🔥 Données du formulaire:', formData);

    if (this.isLoading) {
      console.warn('⚠️ Création déjà en cours');
      return;
    }

    this.isLoading = true;

    this.employeeService.createEmployee(formData).subscribe({
      next: (response) => {
        console.log('✅ Employé créé:', response);
        this.isLoading = false;

        if (response.success) {
          this.notification.success('Employé créé avec succès');
          // Naviguer après une courte pause
          setTimeout(() => {
            this.router.navigate(['/employees', response.employee._id]);
          }, 500);
        } else {
          this.notification.error('Erreur lors de la création');
        }
      },
      error: (error) => {
        console.error('❌ Erreur création employé:', error);
        this.isLoading = false;

        // Afficher le message d'erreur du serveur
        const message = error?.error?.message || 'Erreur lors de la création de l\'employé';
        this.notification.error(message);
      }
    });
  }

  onCancel(): void {
    console.log('🚫 Annulation');
    this.router.navigate(['/employees']);
  }
}
