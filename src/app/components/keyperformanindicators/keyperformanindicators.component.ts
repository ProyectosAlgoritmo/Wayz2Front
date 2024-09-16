import { Component } from '@angular/core';
import { SharedStateService } from '../../services/shared-state.service';

@Component({
  selector: 'app-keyperformanindicators',
  standalone: true,
  imports: [],
  templateUrl: './keyperformanindicators.component.html',
  styleUrl: './keyperformanindicators.component.css'
})
export class KeyperformanindicatorsComponent {

  constructor(private sharedStateService: SharedStateService){}

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);
  }

 

}
