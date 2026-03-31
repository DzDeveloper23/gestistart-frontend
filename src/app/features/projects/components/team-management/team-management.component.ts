import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-team-management',
  standalone: false,
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.scss'
})
export class TeamManagementComponent {
  @Input() team: any[] = [];
  @Input() availableEmployees: any[] = [];
  @Output() addMember = new EventEmitter<string>();
  @Output() removeMember = new EventEmitter<string>();

  selectedEmployee: string = '';
  showAddModal = false;

  onAddMember(): void {
    if (this.selectedEmployee) {
      this.addMember.emit(this.selectedEmployee);
      this.selectedEmployee = '';
      this.showAddModal = false;
    }
  }

  onRemoveMember(employeeId: string): void {
    this.removeMember.emit(employeeId);
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedEmployee = '';
  }

  get filteredEmployees(): any[] {
    const teamIds = this.team.map(t => t._id);
    return this.availableEmployees.filter(emp => !teamIds.includes(emp._id));
  }
}
