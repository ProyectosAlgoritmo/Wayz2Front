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
import { ChatService } from '../../../services/chat-service.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ChatAIComponent } from '../../chat-ai/chat-ai.component';
import { MatDialog } from '@angular/material/dialog';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';




@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatIconModule, MatSidenav, MatListModule, MatToolbarModule, MatMenuModule,
   MatSidenavModule, MatButtonModule, MatTooltipModule, CommonModule, RouterModule, FormsModule,
   NzIconModule, NzButtonModule, NzInputModule, ChatAIComponent,NzBadgeModule, NzAvatarModule, MatBadgeModule
   ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  isVisibleMenu = true;
  chatVisible: boolean = false;
  notificationState: string = '';
  notificationIcon: string = ''; // Default icon
  localStorageSubscription!: Subscription;
  notificationSubscription!: Subscription;
  Companyestate: boolean = false;
  notificationNumber: number= 0; 
  isVisiblestatecompany: boolean = false;

  userInput: string = '';
  chatResponse: string = '';
  
  
  constructor(private chatService: ChatService, private authservice: AuthService, private sharedStateService: SharedStateService, 
    private notificationService: NotificationService, private router: Router,
    private firestore: Firestore, public dialog: MatDialog 
  ){


    this.sharedStateService.toggleChatVisibility(false);

   this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
    });

    this.sharedStateService.isChatVisible$.subscribe(visible => {
      this.chatVisible = visible;
    });
  }

  ngOnInit(): void {
  
    this.localStorageSubscription = this.sharedStateService.notificationState$.subscribe(idEmpresa => {
      //this.notificationState = idEmpresa;
      this.subscribeToNotificationState();  // Actualiza la UI o realiza acciones necesarias
    });

    // Subscribe to menu visibility changes
    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
    });

    this.sharedStateService.isVisiblestatecompany$.subscribe(isVisible => {
      this.isVisiblestatecompany = isVisible;
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

    this.Companyestate = true;

    const idEmpresa = sessionStorage.getItem('id_empresa');
    if (idEmpresa) {
      // Suscribirse al estado de notificación de Firestore
      this.notificationSubscription = this.notificationService.getNotificationState(idEmpresa)
        .subscribe((data: any) => {
          if (data && data.State) {
            this.notificationState = data.State;
            this.notificationNumber = data.notifications;
            this.updateNotificationIcon(this.notificationState);
          }
        });
    }
  }

gologactivities(){
  this.router.navigate(['/activitylog']);

}

goHome()
{
  this.router.navigate(['/']);
}


logout()
{
   this.authservice.logout(); 
   localStorage.clear();
   sessionStorage.clear();
}

  toggleSidenav(): void {
    if(this.isVisibleMenu){
    this.sharedStateService.toggleSidenav();
    }
  }

  updateNotificationIcon(state: string) {

    if(this.isVisiblestatecompany == true)
    {
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
          this.notificationIcon = 'error';
          break;
      default:
        this.notificationIcon = '';
     }
   }
   else{
    this.notificationIcon = '';
   }
  }


  sendMessage() {
    this.chatService.getChatResponse(this.userInput).subscribe(response => {
      this.chatResponse = response;
    });

    //const dialogRef = this.dialog.open(ChatAIComponent);

  }


  toggleChat(): void {
    this.chatVisible = !this.chatVisible;
  }

}
