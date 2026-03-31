import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Employee } from '../../models/employee.model';
import { SharedService } from '../../../../shared/services/shared.service';


@Component({
  selector: 'app-employees-list',
  standalone: false,
  templateUrl: './employees-list.component.html',
  styleUrl: './employees-list.component.scss'
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  isLoading = true;
  currentPage = 1;
  totalPages = 1;
  limit = 9;

  // Filters
  selectedStatus = '';
  selectedRole = '';
  searchQuery = '';

  // Confirmation modal
  showDeleteModal = false;
  employeeToDelete: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private notification: NotificationService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;

    const filters: any = {};
    if (this.selectedStatus) filters.status = this.selectedStatus;
    if (this.selectedRole) filters.role = this.selectedRole;
    if (this.searchQuery) filters.search = this.searchQuery;

  this.employeeService.getAllEmployees(filters, this.currentPage, this.limit).subscribe({
    next: (response) => {
      if (response.success) {
        this.employees = response.data || []; // ✅ Changé de response.employees à response.data
        this.totalPages = response.pagination?.pages || 1;

        // 🔥 mettre à jour le badge en temps réel
        this.sharedService.updateEmployeesCount(this.employees.length);
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading employees:', error);
      this.isLoading = false;
    }
  });
}

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadEmployees();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  viewEmployee(employeeId: string): void {
    this.router.navigate(['/employees', employeeId]);
  }

  editEmployee(employeeId: string): void {
    this.router.navigate(['/employees', employeeId, 'edit']);
  }

  confirmDelete(employeeId: string): void {
    this.employeeToDelete = employeeId;
    this.showDeleteModal = true;
  }

  deleteEmployee(): void {
    if (!this.employeeToDelete) return;

    this.employeeService.deleteEmployee(this.employeeToDelete).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Employé supprimé avec succès');
          this.showDeleteModal = false;
          this.employeeToDelete = null;
          this.loadEmployees();
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.showDeleteModal = false;
        this.employeeToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  createEmployee(): void {
    this.router.navigate(['/employees/create']);
  }

  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedRole = '';
    this.searchQuery = '';
    this.onFilterChange();
  }
}
