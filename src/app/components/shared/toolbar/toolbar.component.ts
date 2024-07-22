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

  constructor(private authservice: AuthService, private sharedStateService: SharedStateService){

    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
    });
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

}
