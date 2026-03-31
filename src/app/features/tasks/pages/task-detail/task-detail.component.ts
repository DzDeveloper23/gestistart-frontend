import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit  {
    task: Task | null = null;
  isLoading = true;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    }
  }

  loadTask(id: string): void {
    this.isLoading = true;
    this.taskService.getTaskById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.task = response.task;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading task:', error);
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  deleteTask(): void {
    if (!this.task) return;

    this.taskService.deleteTask(this.task._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Tâche supprimée avec succès');
          this.router.navigate(['/tasks']);
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  onAddComment(texte: string): void {
    if (!this.task) return;

    this.taskService.addComment(this.task._id, texte).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Commentaire ajouté');
          this.loadTask(this.task!._id);
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  onDeleteComment(commentId: string): void {
    if (!this.task) return;

    this.taskService.deleteComment(this.task._id, commentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Commentaire supprimé');
          this.loadTask(this.task!._id);
        }
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
      }
    });
  }

  onAddAttachment(data: { nom: string, url: string }): void {
    if (!this.task) return;

    this.taskService.addAttachment(this.task._id, data.nom, data.url).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Fichier ajouté');
          this.loadTask(this.task!._id);
        }
      },
      error: (error) => {
        console.error('Error adding attachment:', error);
      }
    });
  }

  onRemoveAttachment(attachmentId: string): void {
    if (!this.task) return;

    this.taskService.removeAttachment(this.task._id, attachmentId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Fichier supprimé');
          this.loadTask(this.task!._id);
        }
      },
      error: (error) => {
        console.error('Error removing attachment:', error);
      }
    });
  }

  isOverdue(): boolean {
    if (!this.task?.dateEcheance) return false;
    return new Date(this.task.dateEcheance) < new Date() && this.task.status !== 'Terminée';
  }
}
