import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SharedService, Notification } from '../../../shared/services/shared.service';
import { User } from '../../../core/models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
  // ✅ SUPPRIMÉ changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showUserMenu = false;
  showNotifications = false;
  notifications: Notification[] = [];
  unreadCount = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🔍 NAVBAR - Initialisation');

    // ✅ S'abonner aux changements de l'utilisateur courant
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        console.log('🔄 NAVBAR - Utilisateur mis à jour:', user);
        console.log('🔄 NAVBAR - Rôle:', user?.role);
        this.currentUser = user;
        this.cdr.detectChanges(); // ✅ Forcer la détection des changements
      });

    // ✅ S'abonner aux notifications en temps réel
    this.sharedService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.cdr.markForCheck();
      });

    // ✅ S'abonner au compte des non-lues
    this.sharedService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      this.sharedService.markAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.sharedService.markAllAsRead();
  }

  deleteNotification(id: string): void {
    this.sharedService.deleteNotification(id);
  }

  getUnreadCount(): number {
    return this.unreadCount;
  }

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'info': return 'bi-info-circle';
      case 'warning': return 'bi-exclamation-triangle';
      case 'success': return 'bi-check-circle';
      case 'error': return 'bi-x-circle';
      default: return 'bi-bell';
    }
  }
}
