import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-project-create',
  standalone: false,
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent implements OnInit {
  isLoading = false;
  clients: any[] = [];
  employees: any[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadEmployees();
  }

  loadClients(): void {
    this.http.get<any>(`${environment.apiUrl}/clients?limit=100`).subscribe({
      next: (response) => {
        console.log('📋 Réponse clients:', response);

        if (response.success) {
          // ✅ Utiliser "data" au lieu de "clients"
          this.clients = response.data || response.clients || [];
          console.log('✅ Clients chargés:', this.clients.length);
          console.log('📊 Clients:', this.clients.map(c => c.nomEntreprise));
        }
      },
      error: (error) => {
        console.error('❌ Error loading clients:', error);
        this.notification.error('Erreur lors du chargement des clients');
      }
    });
  }

  loadEmployees(): void {
    this.http.get<any>(`${environment.apiUrl}/employees?limit=100`).subscribe({
      next: (response) => {
        console.log('👥 Réponse employés:', response);

        if (response.success) {
          // ✅ Utiliser "data" au lieu de "employees"
          let employeesList = response.data || response.employees || [];

          // ✅ Filtrer les employés valides (ceux qui ont un poste)
          this.employees = employeesList.filter((emp: any) => {
            const isValid = emp.poste && emp.nom && emp._id;
            if (!isValid) {
              console.warn('⚠️ Employé invalide filtré:', emp.nom || emp.email);
            }
            return isValid;
          });

          console.log('✅ Employés chargés:', this.employees.length);
          console.log('👥 Employés:', this.employees.map(e => ({ nom: e.nom, poste: e.poste })));
        }
      },
      error: (error) => {
        console.error('❌ Error loading employees:', error);
        this.notification.error('Erreur lors du chargement des employés');
      }
    });
  }

  onSubmit(formData: any): void {
    this.isLoading = true;

    this.projectService.createProject(formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Projet créé avec succès');
          this.router.navigate(['/projects', response.project._id]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.notification.error('Erreur lors de la création du projet');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }
}
