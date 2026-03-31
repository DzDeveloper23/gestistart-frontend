import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-card',
  standalone: false,
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.scss'
})
export class ClientCardComponent {
  @Input() client!: Client;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onView(): void {
    this.view.emit(this.client._id);
  }

  onEdit(): void {
    this.edit.emit(this.client._id);
  }

  onDelete(): void {
    this.delete.emit(this.client._id);
  }
}
