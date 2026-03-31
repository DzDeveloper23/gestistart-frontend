import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-task-comments',
  standalone: false,
  templateUrl: './task-comments.component.html',
  styleUrl: './task-comments.component.scss'
})
export class TaskCommentsComponent {
  @Input() comments: any[] = [];
  @Output() addComment = new EventEmitter<string>();
  @Output() deleteComment = new EventEmitter<string>();

  commentForm!: FormGroup;
  currentUserId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.initForm();
    this.currentUserId = this.authService.getCurrentUser()?._id || null;
  }

  initForm(): void {
    this.commentForm = this.fb.group({
      texte: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.addComment.emit(this.commentForm.value.texte);
    this.commentForm.reset();
  }

  onDeleteComment(commentId: string): void {
    this.deleteComment.emit(commentId);
  }

  canDeleteComment(comment: any): boolean {
    return this.currentUserId === comment.userId?._id;
  }

  get texte() {
    return this.commentForm.get('texte');
  }
}
