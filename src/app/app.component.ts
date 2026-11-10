
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { NotificationSocketService } from './core/services/notification-socket.service';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'GestiStart-FrontEnd';

  private authSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private socketService: NotificationSocketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {

    // Surveiller l'état de connexion
    this.authSubscription = this.authService.currentUser$.subscribe(user => {

      if (user && this.authService.getToken()) {
        this.socketService.connect();
      } else {
        this.socketService.disconnect();
      }

    });

    // Recevoir les nouvelles notifications
    this.notificationSubscription = this.socketService.notification$.subscribe(notification => {

      console.log('🔔 Nouvelle notification reçue:', notification);

      this.notificationService.info(
        notification.message,
        notification.title
      );

    });

  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.notificationSubscription?.unsubscribe();
    this.socketService.disconnect();
  }

}
