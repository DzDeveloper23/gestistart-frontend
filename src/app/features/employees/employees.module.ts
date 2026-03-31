import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { EmployeesRoutingModule } from './employees-routing.module';

// Pages
import { EmployeesListComponent } from './pages/employees-list/employees-list.component';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { EmployeeCreateComponent } from './pages/employee-create/employee-create.component';
import { EmployeeEditComponent } from './pages/employee-edit/employee-edit.component';

// Components
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeStatsComponent } from './components/employee-stats/employee-stats.component';


@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeeDetailComponent,
    EmployeeCreateComponent,
    EmployeeEditComponent,
    EmployeeCardComponent,
    EmployeeFormComponent,
    EmployeeStatsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EmployeesRoutingModule
  ]
})
export class EmployeesModule { }
