import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/*Componentes*/
import { HomeComponent } from './components/home/home.component';
import { LateralmenuComponent } from './components/shared/lateralmenu/lateralmenu.component';
import { LoginComponent } from './components/authorization/login/login.component';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from './services/auth.service';
import { take, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    RouterLinkActive, RouterLink, MatSlideToggleModule, LateralmenuComponent, LoginComponent, HomeComponent, 
    CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Strategicview';
  isLogged = false;

  constructor(private authService: AuthService, private router: Router,) {}
 
  ngOnInit() {
    this.authService.isAuthenticated().subscribe(authStatus => {
      this.isLogged  = authStatus;
      if (!this.isLogged) {
        this.router.navigate(['/login']);
      }
  
      console.log(this.isLogged);
    });
  }
}
