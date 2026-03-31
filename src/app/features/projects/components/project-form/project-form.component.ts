import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: false,
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  @Input() project?: Project;
  @Input() clients: any[] = [];
  @Input() employees: any[] = [];
  @Input() isLoading = false;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  projectForm!: FormGroup;
  isEditMode = false;

  statusOptions = ['En cours', 'En attente', 'Terminé', 'Suspendu'];
  priorityOptions = ['Basse', 'Moyenne', 'Haute', 'Critique'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.project;
    this.initForm();
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      titre: [this.project?.titre || '', [Validators.required, Validators.minLength(3)]],
      description: [this.project?.description || ''],
      clientId: [this.project?.clientId?._id || '', Validators.required],
      budget: [this.project?.budget || '', [Validators.required, Validators.min(0)]],
      dateDebut: [this.formatDate(this.project?.dateDebut), Validators.required],
      dateFin: [this.formatDate(this.project?.dateFin), Validators.required],
      priorite: [this.project?.priorite || 'Moyenne', Validators.required],
      notes: [this.project?.notes || ''],
      team: [this.project?.team?.map(t => t._id) || []]
    });
  }

  formatDate(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.projectForm.value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Getters
  get titre() { return this.projectForm.get('titre'); }
  get description() { return this.projectForm.get('description'); }
  get clientId() { return this.projectForm.get('clientId'); }
  get budget() { return this.projectForm.get('budget'); }
  get dateDebut() { return this.projectForm.get('dateDebut'); }
  get dateFin() { return this.projectForm.get('dateFin'); }
  get priorite() { return this.projectForm.get('priorite'); }
  get notes() { return this.projectForm.get('notes'); }
  get team() { return this.projectForm.get('team'); }
}
