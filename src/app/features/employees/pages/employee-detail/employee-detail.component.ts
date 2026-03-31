import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-detail',
  standalone: false,
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.scss'
})
export class EmployeeDetailComponent implements OnInit {
    employee: Employee | null = null;
  employeeTasks: any[] = [];
  employeeProjects: any[] = [];
  employeeStats: any = null;
  isLoading = true;
  showDeleteModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.loadEmployee(employeeId);
      this.loadEmployeeTasks(employeeId);
      this.loadEmployeeProjects(employeeId);
      this.loadEmployeeStats(employeeId);
    }
  }

  loadEmployee(id: string): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.employee = response.employee;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.isLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  loadEmployeeTasks(id: string): void {
    this.employeeService.getEmployeeTasks(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeTasks = response.tasks || [];
        }
      },
      error: (error) => {
        console.error('Error loading employee tasks:', error);
      }
    });
  }

  loadEmployeeProjects(id: string): void {
    this.employeeService.getEmployeeProjects(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeProjects = response.projects || [];
        }
      },
      error: (error) => {
        console.error('Error loading employee projects:', error);
      }
    });
  }

  loadEmployeeStats(id: string): void {
    this.employeeService.getEmployeeStats(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.employeeStats = response.stats;
        }
      },
      error: (error) => {
        console.error('Error loading employee stats:', error);
      }
    });
  }

  editEmployee(): void {
    if (this.employee) {
      this.router.navigate(['/employees', this.employee._id, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  deleteEmployee(): void {
    if (!this.employee) return;

    this.employeeService.deleteEmployee(this.employee._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Employé supprimé avec succès');
          this.router.navigate(['/employees']);
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  viewTask(taskId: string): void {
    this.router.navigate(['/tasks', taskId]);
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }
}
