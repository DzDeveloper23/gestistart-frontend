import { Component , Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: false,
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {
    @Input() client?: Client;
  @Input() isLoading = false;
  @Output() submitForm = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  clientForm!: FormGroup;
  isEditMode = false;

  statusOptions = ['Actif', 'Inactif', 'Prospect'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.client;
    this.initForm();
  }

  initForm(): void {
    this.clientForm = this.fb.group({
      nomContact: [this.client?.nomContact || '', [Validators.required, Validators.minLength(3)]],
      nomEntreprise: [this.client?.nomEntreprise || '', [Validators.required, Validators.minLength(2)]],
      email: [this.client?.email || '', [Validators.required, Validators.email]],
      telephone: [this.client?.telephone || ''],
      adresse: [this.client?.adresse || ''],
      status: [this.client?.status || 'Prospect', Validators.required],
      notes: [this.client?.notes || '']
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.submitForm.emit(this.clientForm.value);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // Getters
  get nomContact() { return this.clientForm.get('nomContact'); }
  get nomEntreprise() { return this.clientForm.get('nomEntreprise'); }
  get email() { return this.clientForm.get('email'); }
  get telephone() { return this.clientForm.get('telephone'); }
  get adresse() { return this.clientForm.get('adresse'); }
  get status() { return this.clientForm.get('status'); }
  get notes() { return this.clientForm.get('notes'); }
}
