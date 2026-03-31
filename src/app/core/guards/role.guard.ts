import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedRoles = route.data['roles'] as string[];

    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }

    if (this.authService.hasRole(allowedRoles)) {
      return true;
    }

    // Accès refusé
    this.notification.error('Vous n\'avez pas les permissions nécessaires', 'Accès refusé');
    return this.router.createUrlTree(['/dashboard']);
  }
}
