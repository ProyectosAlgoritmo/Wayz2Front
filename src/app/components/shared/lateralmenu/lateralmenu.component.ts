import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes }   from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-lateralmenu',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatToolbarModule,
    MatListModule, RouterOutlet, FormsModule, MatMenuModule, MatExpansionModule, MatTooltipModule, 
    RouterModule, CommonModule, MatSidenav
  ],
  templateUrl: './lateralmenu.component.html',
  styleUrl: './lateralmenu.component.css'
})
export class LateralmenuComponent {
  isExpanded = true;
  sidenavWidth = 230;

  selectedMenuItem: string | null = null;

  constructor(private authservice: AuthService){}


  increase(menuItem: string | null = null, expand: boolean | null = true){

    if(expand){
      if(this.isExpanded)
        { 
          this.sidenavWidth = 60;
        }
      else{
        this.sidenavWidth = 230;
      }
      this.isExpanded = !this.isExpanded
    }

    if (menuItem) {
      this.selectedMenuItem = menuItem;
    }
  }

  logout()
  {
    this.authservice.logout(); 
  }
  
}
