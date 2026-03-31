import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';  // ✅ Ajouté

@Component({
  selector: 'app-page-header',
  standalone: false,
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() showBackButton: boolean = false;

  constructor(private location: Location) {}  // ✅ Ajouté

  goBack(): void {  // ✅ Ajouté
    this.location.back();
  }
}
