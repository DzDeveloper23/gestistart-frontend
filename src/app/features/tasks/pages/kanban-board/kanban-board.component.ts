import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-kanban-board',
  standalone: false,
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.scss'
})
export class KanbanBoardComponent implements OnInit {
    kanbanData: any = {
    'À faire': [],
    'En cours': [],
    'En révision': [],
    'Terminée': []
  };
  projects: any[] = [];
  selectedProject = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private notification: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadProjects();

    // Check if projectId in query params
    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.selectedProject = params['projectId'];
        this.loadKanbanData();
      } else {
        this.isLoading = false;
      }
    });
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

  onProjectChange(): void {
    if (this.selectedProject) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { projectId: this.selectedProject },
        queryParamsHandling: 'merge'
      });
      this.loadKanbanData();
    }
  }

  loadKanbanData(): void {
    if (!this.selectedProject) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.taskService.getKanbanView(this.selectedProject).subscribe({
      next: (response) => {
        if (response.success) {
          this.kanbanData = response.kanban;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading kanban data:', error);
        this.isLoading = false;
      }
    });
  }

  onStatusChange(event: { taskId: string, status: string }): void {
    this.taskService.updateTaskStatus(event.taskId, event.status).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Tâche déplacée');
          this.loadKanbanData();
        }
      },
      error: (error) => {
        console.error('Error updating status:', error);
        this.loadKanbanData(); // Reload to revert changes
      }
    });
  }

  onViewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  goToListView(): void {
    this.router.navigate(['/tasks']);
  }

  createTask(): void {
    this.router.navigate(['/tasks/create'], {
      queryParams: this.selectedProject ? { projectId: this.selectedProject } : {}
    });
  }
}
