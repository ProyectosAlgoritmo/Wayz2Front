import { Component } from '@angular/core';
import { CashFlowCategoriesComponent } from './cash-flow-categories/cash-flow-categories.component';
import { CashFlowTypesComponent } from './cash-flow-types/cash-flow-types.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-cash-flow-config',
  standalone: true,
  imports: [CashFlowCategoriesComponent, CashFlowTypesComponent, NzTabsModule],
  templateUrl: './cash-flow-config.component.html',
  styleUrl: './cash-flow-config.component.css'
})
export class CashFlowConfigComponent {

  constructor(private sharedStateService: SharedStateService)  { this.sharedStateService.updateSuggestedQuestions([]);
    
  }
  onInit() {
    this.sharedStateService.toggleSidenavVisible(true);
  }

}
