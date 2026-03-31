import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Project } from '../../models/project.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-project-edit',
  standalone: false,
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.scss'
})
export class ProjectEditComponent  implements OnInit{
  project: Project | null = null;
  isLoading = false;
  isLoadingProject = true;
  clients: any[] = [];
  employees: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
      this.loadClients();
      this.loadEmployees();
    }
  }

  loadProject(id: string): void {
    this.isLoadingProject = true;
    this.projectService.getProjectById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.project = response.project;
        }
        this.isLoadingProject = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.isLoadingProject = false;
        this.router.navigate(['/projects']);
      }
    });
  }

  loadClients(): void {
    this.http.get<any>(`${environment.apiUrl}/clients?limit=100`).subscribe({
      next: (response) => {
        if (response.success) {
          this.clients = response.clients || [];
        }
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadEmployees(): void {
    this.http.get<any>(`${environment.apiUrl}/employees?limit=100`).subscribe({
      next: (response) => {
        if (response.success) {
          this.employees = response.employees || [];
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  onSubmit(formData: any): void {
    if (!this.project) return;

    this.isLoading = true;

    this.projectService.updateProject(this.project._id, formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Projet mis à jour avec succès');
          this.router.navigate(['/projects', this.project!._id]);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.project) {
      this.router.navigate(['/projects', this.project._id]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
}
