import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-urgent-tasks-widget',
  standalone: false,
  templateUrl: './urgent-tasks-widget.component.html',
  styleUrl: './urgent-tasks-widget.component.scss'
})
export class UrgentTasksWidgetComponent {
  @Input() tasks: any[] = [];

  constructor(private router: Router) {}

  get displayedTasks(): any[] {
    return this.tasks.slice(-1);
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  viewAllTasks(): void {
    this.router.navigate(['/tasks']);
  }

  isOverdue(task: any): boolean {
    if (!task.dateEcheance) return false;
    return new Date(task.dateEcheance) < new Date();
  }
}
