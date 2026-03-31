import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardRoutingModule } from './dashboard-routing.module';

// Pages
import { DashboardHomeComponent } from './pages/dashboard-home/dashboard-home.component';

// Components
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards.component';
import { RecentProjectsWidgetComponent } from './components/recent-projects-widget/recent-projects-widget.component';
import { UrgentTasksWidgetComponent } from './components/urgent-tasks-widget/urgent-tasks-widget.component';
import { TasksPriorityChartComponent } from './components/charts/tasks-priority-chart/tasks-priority-chart.component';
import { ProjectsStatusChartComponent } from './components/charts/projects-status-chart/projects-status-chart.component';
import { ActivityChartComponent } from './components/charts/activity-chart/activity-chart.component';
import { AlertsWidgetComponent } from './components/alerts-widget/alerts-widget.component';


@NgModule({
  declarations: [
    DashboardHomeComponent,
    KpiCardsComponent,
    RecentProjectsWidgetComponent,
    UrgentTasksWidgetComponent,
    TasksPriorityChartComponent,
    ProjectsStatusChartComponent,
    ActivityChartComponent,
    AlertsWidgetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgApexchartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
