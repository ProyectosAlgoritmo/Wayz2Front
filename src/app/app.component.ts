import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

/*Componentes*/
import { HomeComponent } from './components/home/home.component';
import { LateralmenuComponent } from './components/share/lateralmenu/lateralmenu.component';
import { LoginComponent } from './components/authorization/login/login.component';


import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    RouterLinkActive, RouterLink, MatSlideToggleModule, LateralmenuComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Strategicview';
}
