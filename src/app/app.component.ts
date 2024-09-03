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
import { PowerBiReportComponent } from './components/powerbi-report/powerbi-report.component'; // Asegúrate de importar el componente

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
  sidenavWidth = 10;
  isVisibleMenu = true;
  showPowerBIReport = false;  // Define esta propiedad

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
      this.sidenavWidth = isExpanded ? 280 : 100;
    });

    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
      this.cdr.detectChanges();
    });
  }
}
 
