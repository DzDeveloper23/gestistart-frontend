import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: false,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit  {
  @Input() task?: Task;
  @Input() projects: any[] = [];
  @Input() employees: any[] = [];
  @Input() isLoading = false;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;
  isEditMode = false;

  statusOptions = ['À faire', 'En cours', 'En révision', 'Terminée'];
  priorityOptions = ['Basse', 'Moyenne', 'Haute', 'Critique'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log('📋 TASK FORM - Projects:', this.projects);
    console.log('📋 TASK FORM - Employees:', this.employees);

    this.isEditMode = !!this.task;
    this.initForm();
  }

  initForm(): void {
    this.taskForm = this.fb.group({
      titre: [this.task?.titre || '', [Validators.required, Validators.minLength(5)]],
      description: [this.task?.description || ''],
      projectId: [this.task?.projectId?._id || '', Validators.required],
      assigneId: [this.task?.assigneId?._id || ''],
      status: [this.task?.status || 'À faire'], // ✅ Ajout du status
      priorite: [this.task?.priorite || 'Moyenne', Validators.required],
      dateEcheance: [this.formatDate(this.task?.dateEcheance)]
    });

    console.log('📋 TASK FORM - Form initialisé:', this.taskForm.value);
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    console.log('🔥 TASK FORM - onSubmit appelé');
    console.log('🔥 TASK FORM - Form valid?', this.taskForm.valid);
    console.log('🔥 TASK FORM - Form value:', this.taskForm.value);

    if (this.taskForm.invalid) {
      console.log('❌ TASK FORM - Form invalide');
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        if (control && control.invalid) {
          console.log(`❌ ${key}:`, control.errors);
        }
      });
      this.taskForm.markAllAsTouched();
      return;
    }

    // ✅ Nettoyer les données avant l'envoi
    const formValue = this.taskForm.value;

    // Supprimer assigneId si vide
    if (!formValue.assigneId || formValue.assigneId === '') {
      delete formValue.assigneId;
    }

    // Supprimer dateEcheance si vide
    if (!formValue.dateEcheance || formValue.dateEcheance === '') {
      delete formValue.dateEcheance;
    }

    console.log('✅ TASK FORM - Données à émettre:', formValue);
    this.submitForm.emit(formValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Getters
  get titre() { return this.taskForm.get('titre'); }
  get description() { return this.taskForm.get('description'); }
  get projectId() { return this.taskForm.get('projectId'); }
  get assigneId() { return this.taskForm.get('assigneId'); }
  get status() { return this.taskForm.get('status'); }
  get priorite() { return this.taskForm.get('priorite'); }
  get dateEcheance() { return this.taskForm.get('dateEcheance'); }
}
