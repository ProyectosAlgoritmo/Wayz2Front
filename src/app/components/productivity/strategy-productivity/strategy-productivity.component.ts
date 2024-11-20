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
  updateQuestions() {
    const newQuestions = [
      {
        question: '¿Qué productos o servicios han mostrado las mayores caídas de ventas en el último trimestre y por qué?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Qué clientes muestran el mayor crecimiento en ventas?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Cómo ha variado el margen de ganancia entre las diferentes unidades de negocio en los últimos 12 meses?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Qué áreas presentan los mayores incrementos en costos y cómo podemos controlarlos?',
        api: 'financialperformance/Get-expenses'
      }
    ];
    // Actualizar las preguntas sugeridas usando el servicio compartido
    this.sharedStateService.updateSuggestedQuestions(newQuestions);
    
  }
  ngOnInit() {
    this.sharedStateService.toggleSidenavVisible(true);
    this.updateQuestions();
  }

}
