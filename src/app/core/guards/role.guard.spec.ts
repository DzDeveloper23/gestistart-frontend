import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { RoleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;  // ← ajout

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'createUrlTree']);
    routerSpy.createUrlTree.and.returnValue({} as any);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'hasRole']);  // ← ajout

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },  // ← remplace AuthService
        NotificationService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);   // ← utilisateur connecté
    authServiceSpy.hasRole.and.returnValue(true);           // ← rôle autorisé

    const route = { data: { roles: ['admin'] } } as any;
    expect(guard.canActivate(route)).toBeTrue();
  });
});
