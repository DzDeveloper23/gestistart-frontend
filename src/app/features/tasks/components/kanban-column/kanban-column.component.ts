import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-kanban-column',
  standalone: false,
  templateUrl: './kanban-column.component.html',
  styleUrl: './kanban-column.component.scss'
})
export class KanbanColumnComponent {
    @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() status: string = '';
  @Output() statusChange = new EventEmitter<{ taskId: string, status: string }>();
  @Output() viewTask = new EventEmitter<string>();

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('taskId');
    if (taskId && this.status) {
      this.statusChange.emit({ taskId, status: this.status });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragStart(event: DragEvent, taskId: string): void {
    event.dataTransfer?.setData('taskId', taskId);
  }

  onViewTask(taskId: string): void {
    this.viewTask.emit(taskId);
  }

  getStatusColor(): string {
    const colors: { [key: string]: string } = {
      'À faire': 'secondary',
      'En cours': 'primary',
      'En révision': 'info',
      'Terminée': 'success'
    };
    return colors[this.status] || 'secondary';
  }
}
