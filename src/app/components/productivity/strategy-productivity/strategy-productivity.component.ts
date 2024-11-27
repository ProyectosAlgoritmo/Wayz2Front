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
  onTabChange(index: number): void {
    if (index === 0) {
      //this.updateQuestionsForStrategy();
    } else if (index === 1) {
      this.updateQuestionsForPillar();
    }
  }
  updateQuestionsForPillar() {
    alert('updateQuestionsForPillar');
    const newQuestions = [
      {
        question: '¿Cuál es el avance porcentual global de los pilares estratégicos, destacando los que presentan mayor rezago?  ',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Qué metas específicas dentro de los pilares estratégicos están atrasadas y cuál es el impacto potencial en los objetivos estratégicos generales?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Cuál es la tendencia histórica en el cumplimiento de los objetivos de cada pilar estratégico en los últimos trimestres?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Cómo se compara el avance entre los diferentes pilares estratégicos y qué aprendizajes podemos extraer de los pilares con mejor desempeño?',
        api: 'financialperformance/Get-expenses'
      },
      {
        question: '¿Qué áreas dentro de los pilares estratégicos requieren intervención inmediata para evitar riesgos en la ejecución?',
        api: 'financialperformance/Get-expenses'
      },
      {
        question: '¿Cuál es el pronóstico de cumplimiento de los objetivos estratégicos al final del periodo, basándote en el avance actual y las tendencias proyectadas?',
        api: 'financialperformance/Get-expenses'
      },
    ];
    // Actualizar las preguntas sugeridas usando el servicio compartido
    this.sharedStateService.updateSuggestedQuestions(newQuestions);
    
  }
  // updateQuestions() {
  //   const newQuestions = [
  //     {
  //       question: '¿Qué productos o servicios han mostrado las mayores caídas de ventas en el último trimestre y por qué?',
  //       api: 'financialperformance/Get-income'
  //     },
  //     {
  //       question: '¿Qué clientes muestran el mayor crecimiento en ventas?',
  //       api: 'financialperformance/Get-income'
  //     },
  //     {
  //       question: '¿Cómo ha variado el margen de ganancia entre las diferentes unidades de negocio en los últimos 12 meses?',
  //       api: 'financialperformance/Get-income'
  //     },
  //     {
  //       question: '¿Qué áreas presentan los mayores incrementos en costos y cómo podemos controlarlos?',
  //       api: 'financialperformance/Get-expenses'
  //     }
  //   ];
  //   // Actualizar las preguntas sugeridas usando el servicio compartido
  //   this.sharedStateService.updateSuggestedQuestions(newQuestions);
    
  // }
  ngOnInit() {
    this.sharedStateService.toggleSidenavVisible(true);
    const initialTabIndex = 0; // Cambia según lógica
    if (initialTabIndex === 0) {
      //this.updateQuestionsForStrategy();
    } else if (initialTabIndex === 1) {
      this.updateQuestionsForPillar();
    }
  }

}
