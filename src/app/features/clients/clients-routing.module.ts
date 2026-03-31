import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListComponent } from './pages/clients-list/clients-list.component';
import { ClientDetailComponent } from './pages/client-detail/client-detail.component';
import { ClientCreateComponent } from './pages/client-create/client-create.component';
import { ClientEditComponent } from './pages/client-edit/client-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent
  },
  {
    path: 'create',
    component: ClientCreateComponent
  },
  {
    path: ':id',
    component: ClientDetailComponent
  },
  {
    path: ':id/edit',
    component: ClientEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
