import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-task-create',
  standalone: false,
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent implements OnInit {
  isLoading = false;
  projects: any[] = [];
  employees: any[] = [];
  preselectedProjectId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check if projectId in query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.preselectedProjectId = params['projectId'];
      }
    });

    this.loadProjects();
    this.loadEmployees();
  }

  loadProjects(): void {
    this.http.get<any>(`${environment.apiUrl}/projects?limit=100`).subscribe({
      next: (response) => {
        console.log('📋 Réponse projets:', response);

        if (response.success) {
          // ✅ Utiliser "data" au lieu de "projects"
          this.projects = response.data || response.projects || [];
          console.log('✅ Projets chargés:', this.projects.length);
          console.log('📊 Projets:', this.projects.map(p => p.titre));
        }
      },
      error: (error) => {
        console.error('❌ Error loading projects:', error);
        this.notification.error('Erreur lors du chargement des projets');
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
    console.log('📤 TASK CREATE - FormData reçu:', formData);
    console.log('📤 TASK CREATE - Keys:', Object.keys(formData));

    this.isLoading = true;

    this.taskService.createTask(formData).subscribe({
      next: (response) => {
        console.log('✅ TASK CREATE - Réponse:', response);
        if (response.success) {
          this.notification.success('Tâche créée avec succès');
          this.router.navigate(['/tasks', response.task._id]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ TASK CREATE - Erreur complète:', error);
        console.error('❌ TASK CREATE - error.error:', error.error);
        console.error('❌ TASK CREATE - Message:', error.error?.message);

        this.notification.error(
          error.error?.message || 'Erreur lors de la création de la tâche'
        );
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
