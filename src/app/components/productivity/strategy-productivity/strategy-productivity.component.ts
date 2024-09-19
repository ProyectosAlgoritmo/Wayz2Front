import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { StrategyComponent } from './strategy/strategy.component';
import { StrategicPillarComponent } from './strategic-pillar/strategic-pillar.component';

@Component({
  selector: 'app-strategy-productivity',
  templateUrl: './strategy-productivity.component.html',
  styleUrls: ['./strategy-productivity.component.css'],
  standalone: true,
  imports: [StrategicPillarComponent, StrategyComponent, NzTabsModule],
})
export class StrategyProductivityComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
