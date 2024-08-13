import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';

import { RouterModule}   from '@angular/router';


import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

import { MatMenuModule } from '@angular/material/menu';
import { SharedStateService } from '../../../services/shared-state.service';
import { NotificationService } from '../../../services/notification.service';
import { fromEvent, Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore'; // Importa Firestore si es necesario

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatIconModule, MatSidenav, MatListModule, MatToolbarModule, MatMenuModule,
   MatSidenavModule, MatButtonModule, MatTooltipModule, CommonModule, RouterModule
   ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  isVisibleMenu = true;
  notificationState: string = '';
  notificationIcon: string = 'hourglass_empty'; // Default icon
  localStorageSubscription!: Subscription;
  notificationSubscription!: Subscription;
  
  
  constructor(private authservice: AuthService, private sharedStateService: SharedStateService, private notificationService: NotificationService,
    private firestore: Firestore
  ){

   this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
    });
  }

  ngOnInit(): void {
    // Usa el servicio para obtener el estado de la notificación
    // Escuchar cambios en el id_empresa en localStorage
    //this.localStorageSubscription = fromEvent(window, 'storage').subscribe(() => {
    //  this.subscribeToNotificationState();
    //});

    this.localStorageSubscription = this.sharedStateService.notificationState$.subscribe(idEmpresa => {
      //this.notificationState = idEmpresa;
      this.subscribeToNotificationState();  // Actualiza la UI o realiza acciones necesarias
    });

    // Inicializar suscripción
    //this.subscribeToNotificationState();

    // Subscribe to menu visibility changes
    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
    });
  }

  ngOnDestroy(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.localStorageSubscription) {
      this.localStorageSubscription.unsubscribe();
    }
  }

  subscribeToNotificationState() {
    // Si ya hay una suscripción previa, cancélala
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }

    const idEmpresa = sessionStorage.getItem('id_empresa');
    console.log('empresa: '+ idEmpresa); 
    if (idEmpresa) {
      // Suscribirse al estado de notificación de Firestore
      this.notificationSubscription = this.notificationService.getNotificationState(idEmpresa)
        .subscribe((data: any) => {
          if (data && data.State) {
            this.notificationState = data.State;
            this.updateNotificationIcon(this.notificationState);
          }
        });
    }
  }


logout()
{
   this.authservice.logout(); 
}

  toggleSidenav(): void {
    if(this.isVisibleMenu){
    this.sharedStateService.toggleSidenav();
    }
  }

  updateNotificationIcon(state: string) {
    switch (state) {
      case 'OK':
        this.notificationIcon = 'check_circle';
        break;
      case 'Importando':
        this.notificationIcon = 'autorenew';
        break;
      case 'completed':
        this.notificationIcon = 'check_circle';
        break;
      case 'ERROR':
          this.notificationIcon = 'close';
          break;
      default:
        this.notificationIcon = '';
    }
  }

}
