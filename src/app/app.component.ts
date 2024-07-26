import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/*Componentes*/
import { LateralmenuComponent } from './components/shared/lateralmenu/lateralmenu.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { SharedModule } from './components/shared/shared.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from './services/auth.service';
import { take, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';
import { SharedStateService } from './services/shared-state.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule,
    RouterLinkActive, RouterLink, MatSlideToggleModule, LateralmenuComponent, SharedModule, 
    CommonModule, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
      })),
      transition('void <=> *', [
        animate(300)
      ]),
    ]),
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      state('out', style({
        transform: 'translateX(-100%)'
      })),
      transition('in <=> out', [
        animate(300)
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Strategicview';
  isLogged = false;
  sidenavWidth = 230;
  isVisibleMenu = true; 

constructor(private authService: AuthService, private router: Router, private sharedStateService: SharedStateService,
  private cdr: ChangeDetectorRef
) {

} 

  ngOnInit() {
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isLogged  = authStatus;
      if (!this.isLogged) {
        this.router.navigate(['/login']);
      }
    });

    this.sharedStateService.isExpanded$.subscribe(isExpanded => {

      if(isExpanded)
        { 
          this.sidenavWidth = 230;
        }
      else{
        this.sidenavWidth = 60;
      }
    });

    this.sharedStateService.isVisibleMenu$.subscribe(isVisible => {
      this.isVisibleMenu = isVisible;
      this.cdr.detectChanges();
    });
  }

  
}
