import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-attachments',
  standalone: false,
  templateUrl: './task-attachments.component.html',
  styleUrl: './task-attachments.component.scss'
})
export class TaskAttachmentsComponent {
  @Input() attachments: any[] = [];
  @Output() addAttachment = new EventEmitter<{ nom: string, url: string }>();
  @Output() removeAttachment = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  attachmentForm!: FormGroup;
  showForm = false;
  isUploadingFile = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  initForm(): void {
    this.attachmentForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.attachmentForm.reset();
    }
  }

  // Ouvrir le sélecteur de fichier
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  // Gérer la sélection de fichier
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0) {
      const file = files[0];
      this.handleFile(file);
      // Réinitialiser l'input
      input.value = '';
    }
  }

  // Traiter le fichier sélectionné
  private handleFile(file: File): void {
    this.isUploadingFile = true;

    // Créer un FileReader pour lire le fichier
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileContent = e.target?.result as string;

      // Créer une URL blob du fichier
      const blob = new Blob([fileContent], { type: file.type });
      const fileUrl = URL.createObjectURL(blob);

      // Émettre l'événement avec le nom du fichier et l'URL
      this.addAttachment.emit({
        nom: file.name,
        url: fileUrl
      });

      this.isUploadingFile = false;
      this.showForm = false;
      this.attachmentForm.reset();
    };

    reader.onerror = () => {
      console.error('Erreur lors de la lecture du fichier');
      this.isUploadingFile = false;
    };

    // Lire le fichier comme Data URL (pour les petits fichiers)
    reader.readAsArrayBuffer(file);
  }

  onSubmit(): void {
    if (this.attachmentForm.invalid) {
      this.attachmentForm.markAllAsTouched();
      return;
    }

    this.addAttachment.emit(this.attachmentForm.value);
    this.attachmentForm.reset();
    this.showForm = false;
  }

  onRemoveAttachment(attachmentId: string): void {
    this.removeAttachment.emit(attachmentId);
  }

  getFileIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons: { [key: string]: string } = {
      'pdf': 'bi-file-pdf',
      'doc': 'bi-file-word',
      'docx': 'bi-file-word',
      'xls': 'bi-file-excel',
      'xlsx': 'bi-file-excel',
      'ppt': 'bi-file-ppt',
      'pptx': 'bi-file-ppt',
      'jpg': 'bi-file-image',
      'jpeg': 'bi-file-image',
      'png': 'bi-file-image',
      'gif': 'bi-file-image',
      'zip': 'bi-file-zip',
      'rar': 'bi-file-zip'
    };
    return icons[ext || ''] || 'bi-file-earmark';
  }

  get nom() { return this.attachmentForm.get('nom'); }
  get url() { return this.attachmentForm.get('url'); }
}
