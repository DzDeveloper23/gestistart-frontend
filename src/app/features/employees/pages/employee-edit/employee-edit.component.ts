import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-edit',
  standalone: false,
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnInit {
  employee: Employee | null = null;
  isLoading = false;
  isLoadingEmployee = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private notification: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (employeeId) {
      this.loadEmployee(employeeId);
    }
  }

  loadEmployee(id: string): void {
    this.isLoadingEmployee = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.employee = response.employee;
          console.log('📌 Employee chargé:', this.employee);
        }
        this.isLoadingEmployee = false;
      },
      error: (error) => {
        console.error('Error loading employee:', error);
        this.isLoadingEmployee = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(formData: any): void {
    if (!this.employee) return;

    this.isLoading = true;

    console.log('=== DEBUT MODIFICATION EMPLOYEE ===');
    console.log('FormData:', formData);

    const currentUser = this.authService.getCurrentUser();
    console.log('CurrentUser:', currentUser);
    console.log('Employee userId._id:', this.employee.userId._id);

    this.employeeService.updateEmployee(this.employee._id, formData).subscribe({
      next: (response) => {
        console.log('=== SUCCES UPDATE ===');
        console.log('Response:', response);

        if (response.success) {
          this.notification.success('Employé mis à jour avec succès');

          const cu = this.authService.getCurrentUser();
          const empUserId = this.employee!.userId._id;
          const isSame = cu?._id === empUserId;

          console.log('=== VERIFICATION ===');
          console.log('CurrentUser._id:', cu?._id);
          console.log('Employee.userId._id:', empUserId);
          console.log('Sont identiques?', isSame);

          if (isSame) {
            console.log('🔄 RAFRAICHISSEMENT DE L\'UTILISATEUR...');
            this.authService.refreshCurrentUser().subscribe({
              next: () => {
                console.log('✅ RAFRAICHISSEMENT REUSSI');
                console.log('User apres refresh:', this.authService.getCurrentUser());
                this.router.navigate(['/employees', this.employee!._id]);
              },
              error: (err) => {
                console.error('❌ ERREUR REFRESH:', err);
                this.router.navigate(['/employees', this.employee!._id]);
              }
            });
          } else {
            console.log('⏭️ EMPLOYEE DIFFERENT, NAVIGATION DIRECTE');
            this.router.navigate(['/employees', this.employee!._id]);
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ ERREUR UPDATE COMPLETE:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        console.error('❌ Response:', error.error);
        this.notification.error('Erreur lors de la mise à jour');
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    if (this.employee) {
      this.router.navigate(['/employees', this.employee._id]);
    } else {
      this.router.navigate(['/employees']);
    }
  }
}
