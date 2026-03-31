import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

// Pipes
import { StatusColorPipe } from './pipes/status-color.pipe';
import { PriorityIconPipe } from './pipes/priority-icon.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';


const components = [
  NavbarComponent,
  SidebarComponent,
  FooterComponent,
  LoadingSpinnerComponent,
  ConfirmationModalComponent,
  PageHeaderComponent,
  StatusBadgeComponent
];

const pipes = [
  StatusColorPipe,
  PriorityIconPipe,
  DateFormatPipe
];

@NgModule({
  declarations: [
    ...components,
    ...pipes
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PageHeaderComponent,
    ReactiveFormsModule,
    ...components,
    ...pipes
  ]
})
export class SharedModule { }
