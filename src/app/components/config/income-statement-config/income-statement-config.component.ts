import { Component } from '@angular/core';
import { IncomeStatementCategoriesComponent } from './income-statement-categories/income-statement-categories.component';
import { IncomeStatementTypesComponent } from './income-statement-types/income-statement-types.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-income-statement-config',
  standalone: true,
  imports: [IncomeStatementCategoriesComponent, IncomeStatementTypesComponent, NzTabsModule],
  templateUrl: './income-statement-config.component.html',
  styleUrl: './income-statement-config.component.css'
})
export class IncomeStatementConfigComponent {

  constructor(private sharedStateService: SharedStateService)  { this.sharedStateService.updateSuggestedQuestions([]);
    
  }

}
