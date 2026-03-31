import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { EmployeeService } from '../../../employees/services/employee.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Project } from '../../models/project.model';
import { Employee } from '../../../employees/models/employee.model';

@Component({
  selector: 'app-project-detail',
  standalone: false,
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  projectStats: any = null;
  employees: Employee[] = [];
  isLoading = true;
  showDeleteModal = false;
  availableStatuses: Array<'En cours' | 'En attente' | 'Terminé' | 'Suspendu'> = [
    'En cours',
    'En attente',
    'Terminé',
    'Suspendu'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.loadProject(projectId);
      this.loadProjectStats(projectId);
      this.loadEmployees();
    }
  }

  loadProject(id: string): void {
    this.isLoading = true;
    this.projectService.getProjectById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.project = response.project;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        this.isLoading = false;
        this.router.navigate(['/projects']);
      }
    });
  }

  loadProjectStats(id: string): void {
    this.projectService.getProjectStats(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.projectStats = response.stats;
        }
      },
      error: (error) => {
        console.error('Error loading project stats:', error);
      }
    });
  }

  loadEmployees(): void {
    console.log('📋 Chargement des employés...');

    this.employeeService.getAllEmployees({}, 1, 100).subscribe({
      next: (response: any) => {
        console.log('✅ Réponse reçue:', response);

        // Récupérer les données
        let employeesList = response.data || response.employees || [];

        console.log('📊 Nombre d\'employés bruts:', employeesList.length);

        // ✅ Filtrer les employés valides (ceux qui ont un poste)
        this.employees = employeesList.filter((emp: any) => {
          const isValid = emp.poste && emp.nom && emp._id;
          if (!isValid) {
            console.warn('⚠️ Employé invalide filtré:', emp.nom || emp.email);
          }
          return isValid;
        });

        console.log('👥 Total employés valides:', this.employees.length);
        console.log('👥 Employés:', this.employees.map(e => ({ nom: e.nom, poste: e.poste })));
      },
      error: (error) => {
        // ✅ Si c'est une erreur 403 (Forbidden), c'est normal pour les Employees
        // On ne montre pas d'erreur, on laisse juste la liste vide
        if (error.status === 403) {
          console.log('ℹ️ Accès refusé à la liste des employés (permission insuffisante)');
          this.employees = [];
          return;
        }

        // ✅ Pour les autres erreurs, on montre la notification
        console.error('❌ Erreur chargement employés:', error);
        this.notification.error('Erreur lors du chargement des employés');
        this.employees = [];
      }
    });
  }

  // ✅ NOUVELLE MÉTHODE - Changer le statut du projet
  updateProjectStatus(newStatus: string, event: Event): void {
    event.preventDefault();

    if (!this.project) return;

    // Vérifier que le statut est différent
    if (newStatus === this.project.status) {
      return;
    }

    console.log('🔄 Changement du statut:', this.project.status, '->', newStatus);

    this.projectService.updateProjectStatus(this.project._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success(
            `Statut du projet changé en "${newStatus}"`,
            'Mise à jour réussie'
          );
          // Recharger le projet pour mettre à jour les infos
          this.loadProject(this.project!._id);
        }
      },
      error: (error) => {
        console.error('Erreur changement statut:', error);
        this.notification.error(
          'Erreur lors du changement du statut',
          'Veuillez réessayer'
        );
      }
    });
  }

  editProject(): void {
    if (this.project) {
      this.router.navigate(['/projects', this.project._id, 'edit']);
    }
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  deleteProject(): void {
    if (!this.project) return;

    this.projectService.deleteProject(this.project._id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Projet supprimé avec succès');
          this.router.navigate(['/projects']);
        }
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  addTeamMember(employeeId: string): void {
    if (!this.project) return;

    console.log('➕ Ajout du membre:', employeeId);

    this.projectService.addTeamMember(this.project._id, employeeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Membre ajouté avec succès');
          this.loadProject(this.project!._id);
        }
      },
      error: (error) => {
        console.error('Error adding team member:', error);
        this.notification.error('Erreur lors de l\'ajout du membre');
      }
    });
  }

  removeTeamMember(employeeId: string): void {
    if (!this.project) return;

    console.log('➖ Suppression du membre:', employeeId);

    this.projectService.removeTeamMember(this.project._id, employeeId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Membre retiré avec succès');
          this.loadProject(this.project!._id);
        }
      },
      error: (error) => {
        console.error('Error removing team member:', error);
        this.notification.error('Erreur lors de la suppression du membre');
      }
    });
  }
}
