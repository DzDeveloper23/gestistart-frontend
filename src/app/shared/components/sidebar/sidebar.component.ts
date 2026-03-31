import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { SharedService } from '../../services/shared.service';
import { trigger, transition, style, animate } from '@angular/animations';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';
  searchQuery = '';
  isMobile = false; // ✅ Nouvelle propriété pour détecter mobile

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'bi-speedometer2', route: '/dashboard', badge: undefined },
    { label: 'Projets', icon: 'bi-folder', route: '/projects', badge: undefined },
    { label: 'Tâches', icon: 'bi-check-square', route: '/tasks', badge: 0 },
    { label: 'Clients', icon: 'bi-building', route: '/clients', roles: ['Admin', 'Manager'], badge: 0 },
    { label: 'Employés', icon: 'bi-people', route: '/employees', roles: ['Admin'], badge: 0 }
  ];

  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;

    // Mise à jour de la route active
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        // ✅ Fermer automatiquement sur mobile après navigation
        if (this.isMobile) {
          this.isCollapsed = true;
        }
      });

    // ✅ Initialiser l'état selon la taille d'écran
    this.checkScreenSize();

    // 🔥 Badges en temps réel
    this.sharedService.tasksCount$.subscribe(count => {
      const item = this.menuItems.find(i => i.route === '/tasks');
      if (item) item.badge = count;
    });

    this.sharedService.employeesCount$.subscribe(count => {
      const item = this.menuItems.find(i => i.route === '/employees');
      if (item) item.badge = count;
    });

    this.sharedService.clientsCount$.subscribe(count => {
      const item = this.menuItems.find(i => i.route === '/clients');
      if (item) item.badge = count;
    });

    this.sharedService.projectsCount$.subscribe(count => {
      const item = this.menuItems.find(i => i.route === '/projects');
      if (item) item.badge = count;
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;

    if (this.isMobile) {
      // ✅ Sur mobile, toujours fermée par défaut
      this.isCollapsed = true;
    } else {
      // ✅ Sur desktop, restaurer l'état sauvegardé
      if (wasMobile) {
        // Si on vient de passer de mobile à desktop
        const savedState = localStorage.getItem('sidebarCollapsed');
        this.isCollapsed = savedState === 'true';
      }
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;

    // ✅ Sauvegarder l'état uniquement sur desktop
    if (!this.isMobile) {
      localStorage.setItem('sidebarCollapsed', this.isCollapsed.toString());
    }

    this.toggle.emit(this.isCollapsed);
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  canShowMenuItem(item: MenuItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    return this.authService.hasRole(item.roles);
  }

  get filteredMenuItems(): MenuItem[] {
    if (!this.searchQuery.trim()) return this.menuItems;
    const query = this.searchQuery.toLowerCase();
    return this.menuItems.filter(item => item.label.toLowerCase().includes(query));
  }

  onMobileMenuClick(): void {
    // ✅ Fermer automatiquement sur mobile après clic
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }
}
