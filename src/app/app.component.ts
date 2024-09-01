/* import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LateralmenuComponent } from './components/shared/lateralmenu/lateralmenu.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { SharedStateService } from './services/shared-state.service';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PowerBiReportComponent } from './components/powerbi-report/powerbi-report.component'; // Asegúrate de importar el componente
=======


import { ActivatedRoute } from '@angular/router';
>>>>>>> a83cb02f1308727b0e637a1687326e825eca97de

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatSlideToggleModule,
    CommonModule,
    ToolbarComponent,
    LateralmenuComponent,
    PowerBiReportComponent  // Asegúrate de importar el componente aquí
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate(300)]),
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in <=> out', [animate(300)])
    ]),
  ]
})
export class AppComponent implements OnInit {
  title = 'Strategicview';
  isLogged = false;
<<<<<<< HEAD
  sidenavWidth = 230;
  isVisibleMenu = true;
  showPowerBIReport = false;  // Define esta propiedad
=======
  sidenavWidth = 350;
  isVisibleMenu = true; 
>>>>>>> a83cb02f1308727b0e637a1687326e825eca97de

  constructor(
    private authService: AuthService,
    private sharedStateService: SharedStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isLogged = authStatus;
      if (!this.isLogged) {
        // Navegar a la página de inicio de sesión o similar
      }
    });

    this.sharedStateService.isExpanded$.subscribe(isExpanded => {
<<<<<<< HEAD
      this.sidenavWidth = isExpanded ? 230 : 60;
=======

      if(isExpanded)
        { 
          this.sidenavWidth = 300;
        }
      else{
        this.sidenavWidth = 100;
      }
>>>>>>> a83cb02f1308727b0e637a1687326e825eca97de
    });

    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
      this.cdr.detectChanges();
    });
  }
}
 */

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LateralmenuComponent } from './components/shared/lateralmenu/lateralmenu.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { AuthService } from './services/auth.service';
import { SharedStateService } from './services/shared-state.service';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PowerBiReportComponent } from './components/powerbi-report/powerbi-report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatSlideToggleModule,
    CommonModule,
    ToolbarComponent,
    LateralmenuComponent,
    PowerBiReportComponent  // Importa y utiliza el componente PowerBiReportComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition('void <=> *', [animate(300)]),
    ]),
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      state('out', style({ transform: 'translateX(-100%)' })),
      transition('in <=> out', [animate(300)])
    ]),
  ]
})
export class AppComponent implements OnInit {
  title = 'Strategicview';
  isLogged = false;
  sidenavWidth = 230;
  isVisibleMenu = true;
  showPowerBIReport = false;  // Propiedad para controlar la visibilidad del reporte

  constructor(
    private authService: AuthService,
    private sharedStateService: SharedStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Suscribirse a la autenticación del usuario
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isLogged = authStatus;
      if (!this.isLogged) {
        // Lógica para redirigir al usuario si no está autenticado
      }
    });

    // Suscribirse al estado expandido del menú lateral
    this.sharedStateService.isExpanded$.subscribe(isExpanded => {
      this.sidenavWidth = isExpanded ? 230 : 60;
    });

    // Suscribirse a la visibilidad del menú
    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
      this.cdr.detectChanges();
    });
  }
}
