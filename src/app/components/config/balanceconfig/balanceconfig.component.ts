import { Component } from '@angular/core';
import { BalanceComponent } from './balance/balance.component';
import { TypebalanceComponent } from './typebalance/typebalance.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-balanceconfig',
  standalone: true,
  imports: [BalanceComponent, TypebalanceComponent, NzTabsModule],
  templateUrl: './balanceconfig.component.html',
  styleUrl: './balanceconfig.component.css'
})
export class BalanceconfigComponent {

}
