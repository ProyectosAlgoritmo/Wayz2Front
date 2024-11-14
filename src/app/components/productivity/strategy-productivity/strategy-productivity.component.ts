import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { StrategyComponent } from './strategy/strategy.component';
import { StrategicPillarComponent } from './strategic-pillar/strategic-pillar.component';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-strategy-productivity',
  templateUrl: './strategy-productivity.component.html',
  styleUrls: ['./strategy-productivity.component.css'],
  standalone: true,
  imports: [StrategicPillarComponent, StrategyComponent, NzTabsModule],
})
export class StrategyProductivityComponent implements OnInit {

  constructor(private sharedStateService: SharedStateService) { }

  ngOnInit() {
    this.sharedStateService.toggleSidenavVisible(true);
  }

}
