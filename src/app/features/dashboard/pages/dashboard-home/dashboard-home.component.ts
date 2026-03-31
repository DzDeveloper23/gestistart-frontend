import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: false,
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  isLoading = true;
  kpis: any = {
    taches: {
      total: 0
    }
  };
  recentProjects: any[] = [];
  urgentTasks: any[] = [];
  tasksByPriority: any = null;
  tasksByStatus: { [key: string]: number } = {};
  projectsByStatus: any = null;
  activityData: any[] = [];
  riskProjects: any[] = [];
  overdueProjects: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService.getFullDashboard().subscribe({
      next: (response) => {
        if (response.success) {
          const dashboard = response.dashboard;
          this.kpis = dashboard.kpis;
          this.recentProjects = dashboard.recentProjects;
          this.urgentTasks = dashboard.urgentTasks;
          this.tasksByPriority = dashboard.charts.tasksByPriority;
          this.tasksByStatus = dashboard.charts.tasksByStatus;
          this.projectsByStatus = dashboard.charts.projectsByStatus;
          this.activityData = dashboard.charts.activityChart;
          this.riskProjects = dashboard.alerts.riskProjects;
          this.overdueProjects = dashboard.alerts.overdueProjects;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.isLoading = false;
      }
    });
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getStatusColorClass(status: unknown): string {
    const statusStr = String(status);
    const statusMap: { [key: string]: string } = {
      'En attente': 'bg-warning',
      'En cours': 'bg-info',
      'Terminée': 'bg-success',
      'Terminé': 'bg-success',
      'En retard': 'bg-danger',
      'Annulée': 'bg-secondary',
      'Annulé': 'bg-secondary',
      // Ajoutez vos autres statuts selon votre application
    };
    return statusMap[statusStr] || 'bg-secondary';
  }
}
