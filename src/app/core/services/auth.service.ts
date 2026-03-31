import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { NotificationService } from './notification.service';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly USER_KEY = 'currentUser';

  // ✅ Initialiser avec null, puis charger dans le constructor
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private notification: NotificationService
  ) {
    // ✅ Charger l'utilisateur après l'injection du StorageService
    const user = this.getCurrentUserFromStorage();
    this.currentUserSubject.next(user);
  }

  // Login
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.storage.set(this.TOKEN_KEY, response.accessToken);
          this.storage.set(this.USER_KEY, response.user);
          this.currentUserSubject.next(response.user);
          this.notification.success('Connexion réussie', 'Bienvenue');
        }
      })
    );
  }

  // Register
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, data).pipe(
      tap(response => {
        if (response.success) {
          this.notification.success('Compte créé avec succès', 'Inscription');
        }
      })
    );
  }

  // ✅ MÉTHODE AMÉLIORÉE : Rafraîchir l'utilisateur courant depuis le serveur
  refreshCurrentUser(): Observable<any> {
    console.log('🔄 AUTH - Début refresh utilisateur...');

    return this.http.get<any>(`${this.API_URL}/me`).pipe(
      tap(response => {
        console.log('📥 AUTH - Réponse serveur:', response);

        // ✅ Extraire l'utilisateur de la réponse
        const user = response.user || response;

        // ✅ IMPORTANT : Créer un NOUVEL objet (nouvelle référence mémoire)
        const mappedUser: User = {
          _id: user._id || user.id,
          email: user.email,
          nom: user.nom,
          role: user.role, // ✅ Le nouveau rôle est ici
          status: user.status,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date()
        };

        console.log('✅ AUTH - Utilisateur mappé:', mappedUser);
        console.log('✅ AUTH - Nouveau rôle:', mappedUser.role);

        // ✅ Sauvegarder dans le storage
        this.storage.set(this.USER_KEY, mappedUser);

        // ✅ IMPORTANT : Émettre le NOUVEL objet (pas une référence modifiée)
        this.currentUserSubject.next({ ...mappedUser });

        console.log('✅ AUTH - BehaviorSubject mis à jour');
        console.log('✅ AUTH - Valeur actuelle:', this.currentUserSubject.value);
      })
    );
  }

  // ✅ MÉTHODE AMÉLIORÉE : Mettre à jour l'utilisateur localement
  updateCurrentUser(user: User): void {
    console.log('🔄 AUTH - Mise à jour locale utilisateur:', user);

    // ✅ Créer un nouvel objet pour forcer la détection de changement
    const updatedUser = { ...user };

    this.storage.set(this.USER_KEY, updatedUser);
    this.currentUserSubject.next(updatedUser);

    console.log('✅ AUTH - Utilisateur local mis à jour');
  }

  // Logout
  logout(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.notification.info('Vous êtes déconnecté', 'Au revoir');
    this.router.navigate(['/auth/login']);
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtenir le token
  getToken(): string | null {
    return this.storage.get<string>(this.TOKEN_KEY);
  }

  // Obtenir l'utilisateur courant
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Obtenir le rôle de l'utilisateur
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  // Vérifier si Admin
  isAdmin(): boolean {
    return this.hasRole(['Admin']);
  }

  // Vérifier si Manager
  isManager(): boolean {
    return this.hasRole(['Manager']);
  }

  // Vérifier si Employé
  isEmployee(): boolean {
    return this.hasRole(['Employé']);
  }

  // Récupérer l'utilisateur depuis le storage
  private getCurrentUserFromStorage(): User | null {
    try {
      return this.storage.get<User>(this.USER_KEY);
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  }
}
