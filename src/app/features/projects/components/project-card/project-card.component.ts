import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-card',
  standalone: false,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  getBudgetPercent(): number {
    if (!this.project.budget || this.project.budget === 0) return 0;
    return (this.project.montantUtilise / this.project.budget) * 100;
  }

  getBudgetColor(): string {
    const percent = this.getBudgetPercent();
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  }

  onView(): void {
    this.view.emit(this.project._id);
  }

  onEdit(): void {
    this.edit.emit(this.project._id);
  }

  onDelete(): void {
    this.delete.emit(this.project._id);
  }
}
