import { Component } from '@angular/core';
import { LateralmenuComponent } from '../shared/lateralmenu/lateralmenu.component';
import { SharedStateService } from '../../services/shared-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LateralmenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private sharedStateService: SharedStateService){}

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(false);
  }

}
