import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsRoutingModule } from './projects-routing.module';

// Pages
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ProjectCreateComponent } from './pages/project-create/project-create.component';
import { ProjectEditComponent } from './pages/project-edit/project-edit.component';

// Components
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { ProjectStatsComponent } from './components/project-stats/project-stats.component';
import { TeamManagementComponent } from './components/team-management/team-management.component';


@NgModule({
  declarations: [
    ProjectsListComponent,
    ProjectDetailComponent,
    ProjectCreateComponent,
    ProjectEditComponent,
    ProjectCardComponent,
    ProjectFormComponent,
    ProjectStatsComponent,
    TeamManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
