import { Component , Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: false,
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ id: string, status: string }>();

  onView(): void {
    this.view.emit(this.task._id);
  }

  onEdit(): void {
    this.edit.emit(this.task._id);
  }

  onDelete(): void {
    this.delete.emit(this.task._id);
  }

  onStatusChange(status: string): void {
    this.statusChange.emit({ id: this.task._id, status });
  }

  isOverdue(): boolean {
    if (!this.task.dateEcheance) return false;
    return new Date(this.task.dateEcheance) < new Date() && this.task.status !== 'Terminée';
  }
}
