import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee?: Employee;
  @Input() users: any[] = [];
  @Input() isLoading = false;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  employeeForm!: FormGroup;
  isEditMode = false;

  roleOptions = ['Admin', 'Manager', 'Employé'];

  constructor(private fb: FormBuilder) {
    console.log('🚀 FORM - Constructor appelé');
  }

  ngOnInit(): void {
    console.log('🚀 FORM - ngOnInit appelé');
    console.log('🚀 FORM - users:', this.users);
    console.log('🚀 FORM - employee:', this.employee);

    this.isEditMode = !!this.employee;
    this.initForm();

    console.log('🚀 FORM - Formulaire initialisé:', this.employeeForm.value);
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      userId: [
        this.employee?.userId?._id || '',
        [Validators.required]
      ],
      poste: [
        this.employee?.poste || '',
        [Validators.required, Validators.minLength(2)]
      ],
      role: [
        this.employee?.role || 'Employé',
        [Validators.required]
      ],
      salaire: [
        this.employee?.salaire || 0,
        [Validators.required, Validators.min(0)]
      ],
      dateEmbauche: [
        this.formatDate(this.employee?.dateEmbauche) || '',
        [Validators.required]
      ]
    });

    // En mode édition, désactiver userId après la création du groupe
    if (this.isEditMode) {
      this.employeeForm.get('userId')?.disable();
    }
  }

  formatDate(date: any): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur formatage date:', error);
      return '';
    }
  }

  debugClick(): void {
    console.log('🖱️ BOUTON CLIQUÉ');
    console.log('🖱️ Form valid?', this.employeeForm.valid);
    console.log('🖱️ Form value:', this.employeeForm.value);
    console.log('🖱️ Form getRawValue():', this.employeeForm.getRawValue());
    console.log('🖱️ Form errors:', this.employeeForm.errors);
    console.log('🖱️ isLoading?', this.isLoading);

    // Afficher les erreurs de chaque champ
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      if (control && control.invalid) {
        console.log(`❌ ${key} invalide:`, control.errors);
      } else {
        console.log(`✅ ${key} valide:`, control?.value);
      }
    });
  }

  onSubmit(): void {
    console.log('🔥🔥🔥 FORM - onSubmit() APPELÉ 🔥🔥🔥');
    console.log('🔥 FORM - isLoading:', this.isLoading);
    console.log('🔥 FORM - Form valid?', this.employeeForm.valid);
    console.log('🔥 FORM - Form value:', this.employeeForm.value);
    console.log('🔥 FORM - Form getRawValue():', this.employeeForm.getRawValue());


    // Si le formulaire est invalide, afficher les erreurs
    if (this.employeeForm.invalid) {
      console.log('❌ FORM - Formulaire invalide, détails:');
      Object.keys(this.employeeForm.controls).forEach(key => {
        const control = this.employeeForm.get(key);
        if (control && control.invalid) {
          console.log(`❌ ${key}:`, {
            value: control.value,
            errors: control.errors,
            touched: control.touched
          });
        }
      });
      this.employeeForm.markAllAsTouched();
      return;
    }

    // Inclure userId même si disabled en mode édition
    const formValue = this.employeeForm.getRawValue();
    console.log('✅ FORM - Données valides à émettre:', formValue);

  console.log('📤 FORM - Envoi FormData:', formValue);
  console.log('📤 FORM - Employee ID utilisé:', this.employee?._id);
  console.log('📤 FORM - User ID dans formValue:', formValue.userId);

  if (this.isLoading) return;

  this.submitForm.emit(formValue);
    // Vérifier que isLoading n'est pas déjà true
    if (this.isLoading) {
      console.warn('⚠️ FORM - Déjà en cours de chargement, ignorez la double soumission');
      return;
    }

    this.submitForm.emit(formValue);
    console.log('✅ FORM - submitForm.emit() TERMINÉ');
  }

  onCancel(): void {
    console.log('🚫 FORM - onCancel() appelé');
    this.cancel.emit();
  }

  // Getters pour les validations
  get userId() { return this.employeeForm.get('userId'); }
  get poste() { return this.employeeForm.get('poste'); }
  get role() { return this.employeeForm.get('role'); }
  get salaire() { return this.employeeForm.get('salaire'); }
  get dateEmbauche() { return this.employeeForm.get('dateEmbauche'); }
}
