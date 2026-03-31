import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-projects-widget',
  standalone: false,
  templateUrl: './recent-projects-widget.component.html',
  styleUrl: './recent-projects-widget.component.scss'
})
export class RecentProjectsWidgetComponent {
  @Input() projects: any[] = [];

  constructor(private router: Router) {}

  get displayedProjects(): any[] {
    return this.projects.slice(-1);
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/projects', projectId]);
  }

  viewAllProjects(): void {
    this.router.navigate(['/projects']);
  }

  getBudgetPercent(project: any): number {
    if (!project.budget || project.budget === 0) return 0;
    return (project.montantUtilise / project.budget) * 100;
  }

  getBudgetColor(percent: number): string {
    if (percent >= 90) return 'danger';
    if (percent >= 75) return 'warning';
    return 'success';
  }
}
