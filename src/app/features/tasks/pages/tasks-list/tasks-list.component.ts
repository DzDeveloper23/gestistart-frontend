import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Task } from '../../models/task.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SharedService } from '../../../../shared/services/shared.service';


@Component({
  selector: 'app-tasks-list',
  standalone: false,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListComponent implements OnInit {
   tasks: Task[] = [];
  projects: any[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  limit = 12;

  // Filters
  selectedProject = '';
  selectedStatus = '';
  selectedPriority = '';

  // Confirmation modal
  showDeleteModal = false;
  taskToDelete: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private notification: NotificationService,
    private http: HttpClient,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadTasks(

    );
  }

  loadProjects(): void {
    this.http.get<any>(`${environment.apiUrl}/projects?limit=100`).subscribe({
      next: (response) => {
        if (response.success) {
          this.projects = response.projects || [];
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

loadTasks(): void {
  this.isLoading = true;

  const filters: any = {};
  if (this.selectedProject) filters.projectId = this.selectedProject;
  if (this.selectedStatus) filters.status = this.selectedStatus;
  if (this.selectedPriority) filters.priorite = this.selectedPriority;

  this.taskService.getAllTasks(filters, this.currentPage, this.limit).subscribe({
    next: (response) => {
      if (response.success) {
        this.tasks = response.tasks || [];
        this.totalPages = response.pagination?.pages || 1;
        // 🔥 mettre à jour le badge en temps réel
        this.sharedService.updateTasksCount(this.tasks.length);
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading tasks:', error);
      this.isLoading = false;
    }
  });
}

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTasks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  editTask(taskId: string): void {
    // Rediriger vers detail avec option d'édition
    this.router.navigate(['/tasks', taskId], { queryParams: { edit: true } });
  }

  confirmDelete(taskId: string): void {
    this.taskToDelete = taskId;
    this.showDeleteModal = true;
  }

  deleteTask(): void {
    if (!this.taskToDelete) return;

    this.taskService.deleteTask(this.taskToDelete).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Tâche supprimée avec succès');
          this.showDeleteModal = false;
          this.taskToDelete = null;
          this.loadTasks();
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.showDeleteModal = false;
        this.taskToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.taskToDelete = null;
  }

  createTask(): void {
    this.router.navigate(['/tasks/create']);
  }

  goToKanban(): void {
    this.router.navigate(['/tasks/kanban']);
  }

  onStatusChange(event: { id: string, status: string }): void {
    this.taskService.updateTaskStatus(event.id, event.status).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Statut mis à jour');
          this.loadTasks();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  clearFilters(): void {
    this.selectedProject = '';
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.onFilterChange();
  }
}
