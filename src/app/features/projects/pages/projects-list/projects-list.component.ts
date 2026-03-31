import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Project } from '../../models/project.model';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-projects-list',
  standalone: false,
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  limit = 9;

  // Filters
  selectedStatus = '';
  selectedPriority = '';

  // Confirmation modal
  showDeleteModal = false;
  projectToDelete: string | null = null;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private notification: NotificationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;

    const filters: any = {};
    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.selectedPriority) filters.priorite = this.selectedPriority;

    this.projectService.getAllProjects(filters, this.currentPage, this.limit).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.projects || response.data || [];
          this.totalPages = response.pagination?.pages || 1;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
  });
}

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProjects();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProjects();
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  editProject(projectId: string): void {
    this.router.navigate(['/projects', projectId, 'edit']);
  }

  confirmDelete(projectId: string): void {
    this.projectToDelete = projectId;
    this.showDeleteModal = true;
  }

  deleteProject(): void {
    if (!this.projectToDelete) return;

    this.projectService.deleteProject(this.projectToDelete).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Projet supprimé avec succès');
          this.showDeleteModal = false;
          this.projectToDelete = null;
          this.loadProjects();
        }
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        this.showDeleteModal = false;
        this.projectToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.projectToDelete = null;
  }

  createProject(): void {
    this.router.navigate(['/projects/create']);
  }
}
