import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-card',
  standalone: false,
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss'
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onView(): void {
    this.view.emit(this.employee._id);
  }

  onEdit(): void {
    this.edit.emit(this.employee._id);
  }

  onDelete(): void {
    this.delete.emit(this.employee._id);
  }
}
