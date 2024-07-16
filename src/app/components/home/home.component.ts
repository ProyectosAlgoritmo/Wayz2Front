import { Component } from '@angular/core';
import { LateralmenuComponent } from '../share/lateralmenu/lateralmenu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LateralmenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
