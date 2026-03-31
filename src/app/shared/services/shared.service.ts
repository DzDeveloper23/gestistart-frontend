import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  // ===== COMPTEURS =====
  // Clients
  private clientsCountSubject = new BehaviorSubject<number>(0);
  clientsCount$ = this.clientsCountSubject.asObservable();

  // Tâches
  private tasksCountSubject = new BehaviorSubject<number>(0);
  tasksCount$ = this.tasksCountSubject.asObservable();

  // Employés
  private employeesCountSubject = new BehaviorSubject<number>(0);
  employeesCount$ = this.employeesCountSubject.asObservable();

  // Projets
  private projectsCountSubject = new BehaviorSubject<number>(0);
  projectsCount$ = this.projectsCountSubject.asObservable();

  // ===== NOTIFICATIONS =====
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  // ===== COMPTEURS - MÉTHODES =====
  updateClientsCount(count: number): void {
    this.clientsCountSubject.next(count);
  }

  updateTasksCount(count: number): void {
    this.tasksCountSubject.next(count);
  }

  updateEmployeesCount(count: number): void {
    this.employeesCountSubject.next(count);
  }

  updateProjectsCount(count: number): void {
    this.projectsCountSubject.next(count);
  }

  // ===== NOTIFICATIONS - MÉTHODES =====

  // ✅ Charger les notifications existantes
  loadNotifications(): void {
    this.http.get<any>(`${this.apiUrl}`).subscribe({
      next: (response: any) => {
        if (response?.success) {
          const notifications = response.data || response.notifications || [];

          // ✅ Formater les notifications avec vérification des dates
          const formattedNotifications = notifications
            .map((n: any) => ({
              ...n,
              // ✅ Vérifier si le timestamp est valide avant conversion
              timestamp: this.isValidDate(n.timestamp) ? new Date(n.timestamp) : new Date(),
              read: n.read || false
            }))
            // ✅ Filtrer les notifications invalides
            .filter((n: Notification) => n.id && n.title);

          this.notificationsSubject.next(formattedNotifications);
          this.updateUnreadCount();
          console.log('✅ Notifications chargées:', formattedNotifications.length);
        }
      },
      error: (error) => {
        console.error('❌ Erreur chargement notifications:', error);
      }
    });
  }

  // ✅ Vérifier si une date est valide
  private isValidDate(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }

  // ✅ Ajouter une nouvelle notification (reçue en temps réel)
  addNotification(notification: Notification): void {
    // ✅ Vérifier que la notification est valide
    if (!notification.id || !notification.title) {
      console.warn('⚠️ Notification invalide, non ajoutée');
      return;
    }

    // ✅ Vérifier le timestamp
    if (!this.isValidDate(notification.timestamp)) {
      notification.timestamp = new Date();
    }

    const notifications = this.notificationsSubject.value;
    const newNotifications = [notification, ...notifications];
    this.notificationsSubject.next(newNotifications);
    this.updateUnreadCount();
    console.log('🔔 Nouvelle notification ajoutée:', notification.title);
  }

  // ✅ Marquer une notification comme lue
  markAsRead(notificationId: string): void {
    this.http.patch<any>(`${this.apiUrl}/${notificationId}/read`, {}).subscribe({
      next: (response: any) => {
        if (response?.success) {
          const notifications = this.notificationsSubject.value;
          const index = notifications.findIndex(n => n.id === notificationId);
          if (index !== -1) {
            notifications[index].read = true;
            this.notificationsSubject.next([...notifications]);
            this.updateUnreadCount();
            console.log('✅ Notification marquée comme lue');
          }
        }
      },
      error: (error) => {
        console.error('❌ Erreur marquage notification:', error);
      }
    });
  }

  // ✅ Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.http.patch<any>(`${this.apiUrl}/read-all`, {}).subscribe({
      next: (response: any) => {
        if (response?.success) {
          const notifications = this.notificationsSubject.value;
          notifications.forEach(n => n.read = true);
          this.notificationsSubject.next([...notifications]);
          this.updateUnreadCount();
          console.log('✅ Toutes les notifications marquées comme lues');
        }
      },
      error: (error) => {
        console.error('❌ Erreur marquage notifications:', error);
      }
    });
  }

  // ✅ Supprimer une notification
  deleteNotification(notificationId: string): void {
    this.http.delete<any>(`${this.apiUrl}/${notificationId}`).subscribe({
      next: (response: any) => {
        if (response?.success) {
          const notifications = this.notificationsSubject.value.filter(n => n.id !== notificationId);
          this.notificationsSubject.next(notifications);
          this.updateUnreadCount();
          console.log('✅ Notification supprimée');
        }
      },
      error: (error) => {
        console.error('❌ Erreur suppression notification:', error);
      }
    });
  }

  // ✅ Mettre à jour le compte des non-lues
  private updateUnreadCount(): void {
    const count = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(count);
  }

  // ✅ Getters
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }
  private sidebarToggle$ = new Subject<void>();

toggleSidebar(): void {
  this.sidebarToggle$.next();
}

getSidebarToggle$(): Observable<void> {
  return this.sidebarToggle$.asObservable();
}
}
