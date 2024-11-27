import { Component, OnInit } from '@angular/core';
import { SharedStateService } from '../../../../services/shared-state.service';
import { ConfigService } from '../../../../services/config.service';
import { AuxService } from '../../../../services/aux-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { BalanceService } from '../../../../services/balance.service';
import { EdittypebalanceComponent } from '../../../config/balanceconfig/typebalance/edittypebalance/edittypebalance.component';
import { CreatetypebalanceComponent } from '../../../config/balanceconfig/typebalance/createtypebalance/createtypebalance.component';
import { CreateStrategicPillarComponent } from './create-strategic-pillar/create-strategic-pillar.component';
import { ProductivityService } from '../../../../services/productivity.service';
import { TableWithRowsChildComponent } from '../../../shared/table-with-rows-child/table-with-rows-child.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CreateProjectsPilarComponent } from './create-projects-pilar/create-projects-pilar.component';

@Component({
  selector: 'app-strategic-pillar',
  templateUrl: './strategic-pillar.component.html',
  styleUrls: ['./strategic-pillar.component.css'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    SharedModule,
    NzInputModule,
    NzIconModule,
    TableWithRowsChildComponent,
    FormsModule
  ],
})
export class StrategicPillarComponent implements OnInit {
  searchValue: string = '';
  dataSource: any[] = [];
  mainTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre', sortDirection: null },
    { title: 'Estrategia', field: 'estrategia', sortDirection: null },
    { title: 'Descripción', field: 'descripcion', sortDirection: null },
  ];

  subTableColumns = [
    // { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Proyecto', field: 'nombre', sortDirection: null },
    { title: 'Lider de proyecto', field: 'liderProyecto', sortDirection: null },
    { title: 'Estado', field: 'estado', sortDirection: null },
    { title: 'Zona', field: 'zona', sortDirection: null },
    { title: 'Unidad', field: 'unidad', sortDirection: null },
    { title: 'Fecha de inicio', field: 'fechaInicio', sortDirection: null },
    { title: 'Fecha final', field: 'fechaFinal', sortDirection: null },
  ];


  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private router: Router,
    private productivityService: ProductivityService
  ) {
    this.getStrategyPilar();
  }

  updateQuestions() {
    const newQuestions = [
      {
        question: '¿Cuál es el avance porcentual global de los pilares estratégicos, destacando los que presentan mayor rezago?  ',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
      {
        question: '¿Qué metas específicas dentro de los pilares estratégicos están atrasadas y cuál es el impacto potencial en los objetivos estratégicos generales?',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
      {
        question: '¿Cuál es la tendencia histórica en el cumplimiento de los objetivos de cada pilar estratégico en los últimos trimestres?',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
      {
        question: '¿Cómo se compara el avance entre los diferentes pilares estratégicos y qué aprendizajes podemos extraer de los pilares con mejor desempeño?',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
      {
        question: '¿Qué áreas dentro de los pilares estratégicos requieren intervención inmediata para evitar riesgos en la ejecución?',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
      {
        question: '¿Cuál es el pronóstico de cumplimiento de los objetivos estratégicos al final del periodo, basándote en el avance actual y las tendencias proyectadas?',
        api: 'financialperformance/get-strategic-pillar-ia'
      },
    ];
    // Actualizar las preguntas sugeridas usando el servicio compartido
    this.sharedStateService.updateSuggestedQuestions(newQuestions);
    
  }

  ngOnInit(): void {
    //this.updateQuestions();
  }

  onEditClicked(data: any) {
    this.onEditAction(data);
  }

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  applyFilter(event: Event) {}

  onEditAction(event: any) {
    console.log('event ', event);
    const dialogRef = this.dialog.open(CreateStrategicPillarComponent, {
      data: event,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerBalanceTipo().subscribe({
          next: (data) => {
            this.getStrategyPilar();
          },
          error: (error) => {
            this.auxService.AlertError(
              'Error al cargar los tipos de categoría (balance):',
              error
            );
          },
        });
      }
    });
  }

  getStrategyPilar() {
    this.auxService.ventanaCargando();
    this.productivityService
      .get('get-strategic-pillar')
      .subscribe(async (data) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success == true) {
          this.dataSource = data.data;
        }
      });
  }

  onDeleteAction(event: any) {
    console.log('event ', event);
    if (event.table == 'principal') {
      this.DeleteStrategicPillar(event);
    }
    if (event.table == 'subTable') {
      this.DeleteProjectPillar(event);
    }
  }

  async DeleteStrategicPillar(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-strategic-pillar', event.id)
        .subscribe(async (data) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success == true) {
            await this.auxService.AlertSuccess('Ok', data.message);
            this.getStrategyPilar();
          } else {
            await this.auxService.AlertError('Error', data.message);
            //this.getBalance();
          }
        });
    }
  }

  async DeleteProjectPillar(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-project-pillar', event.id)
        .subscribe(async (data) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success == true) {
            await this.auxService.AlertSuccess('Ok', data.message);
            this.getStrategyPilar();
          } else {
            await this.auxService.AlertError('Error', data.message);
            //this.getBalance();
          }
        });
    }
  }

  CreateAction() {
    console.log(event);

    const dialogRef = this.dialog.open(CreateStrategicPillarComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStrategyPilar();
      }
    });
  }
  CreateActionPilarProyec() {
    console.log(event);

    const dialogRef = this.dialog.open(CreateProjectsPilarComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getStrategyPilar();
      }
    });
  }
}
