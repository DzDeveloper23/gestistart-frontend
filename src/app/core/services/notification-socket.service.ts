
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationSocketService implements OnDestroy {

  private socket: Socket | null = null;

  private notificationSubject = new Subject<any>();
  public notification$ = this.notificationSubject.asObservable();

  constructor(
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  connect(): void {
    const token = this.authService.getToken();

    if (!token) {
      console.warn('⚠️ Aucun token disponible pour Socket.IO');
      return;
    }

    if (this.socket?.connected) {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io(environment.apiUrl.replace(/\/api\/?$/, ''), {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket.IO connecté');
    });

    this.socket.on('notification:new', (notification: any) => {
      this.ngZone.run(() => {
        console.log('🔔 Nouvelle notification:', notification);
        this.notificationSubject.next(notification);
      });
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('❌ Erreur Socket.IO:', error.message);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket.IO déconnecté:', reason);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.notificationSubject.complete();
  }
}
