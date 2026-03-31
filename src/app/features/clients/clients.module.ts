import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';

// Pages
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ClientCreateComponent } from './pages/client-create/client-create.component';
import { ClientEditComponent } from './pages/client-edit/client-edit.component';

// Components
import { ClientCardComponent } from './components/client-card/client-card.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientStatsComponent } from './components/client-stats/client-stats.component';


@NgModule({
  declarations: [
    ClientsListComponent,
    ClientDetailComponent,
    ClientCreateComponent,
    ClientEditComponent,
    ClientCardComponent,
    ClientFormComponent,
    ClientStatsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ClientsRoutingModule
  ]
})
export class ClientsModule { }
