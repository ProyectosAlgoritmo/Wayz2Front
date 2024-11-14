import { Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { SharedStateService } from '../../../services/shared-state.service';
import { ConfigService } from '../../../services/config.service';
import { AuxService } from '../../../services/aux-service.service';
import { ProductivityService } from '../../../services/productivity.service';
import { CreateBoardDirectorsReportComponent } from './create-board-directors-report/create-board-directors-report.component';
import { BaseChartDirective } from 'ng2-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import {
  ChartType,
  registerables,
  Chart,
  ChartOptions,
  ChartConfiguration,
} from 'chart.js';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';

@Component({
  selector: 'app-board-directors-report',
  templateUrl: './board-directors-report.component.html',
  styleUrls: ['./board-directors-report.component.css'],
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
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
  ],
})
export class BoardDirectorsReportComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  displayedColumns: string[] = [
    'nombre',
    'descripcionComite',
    'responsable',
    'porcentajeavanceProyectado',
    'porcentajeavanceReal',
    'fecha',
    'etapa',
    'estado',
  ];
  columnNames = {
    nombre: 'Nombre',
    descripcionComite: 'Descripción Comité',
    responsable: 'Responsable',
    porcentajeavanceProyectado: 'Porcentaje Avance Proyectado',
    porcentajeavanceReal: 'Porcentaje Avance Real',
    fecha: 'Fecha',
    etapa: 'Etapa',
    estado: 'Estado',
  };

  public doughnutChartLabels: string[] = [];
  public doughnutChartData = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          '#FF6384', // Rojo-rosado
          '#36A2EB', // Azul
          '#FFCE56', // Amarillo
          '#4BC0C0', // Verde azulado
          '#9966FF', // Púrpura
          '#FF9F40', // Naranja
          '#00FF00', // Verde brillante
          '#FF4500', // Rojo anaranjado
          '#9400D3', // Violeta oscuro
        ],
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right', // Mantener la posición de la leyenda a la derecha
        labels: {
          padding: 20, // Aumentar el espacio entre las etiquetas y la gráfica
          font: {
            size: 12, // Ajustar el tamaño de la fuente de las etiquetas para que sean legibles
          },
          usePointStyle: true, // Hacer los puntos de las leyendas más pequeños
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0, // Eliminar padding extra si las etiquetas están a los lados
      },
    },
  };

  dataSource: any[] = [];
  iconTheme: 'user' | null | undefined = 'user';
  objativesCard: number = 0;
  titleCard: string = 'Objetivos Cumplidos';
  growthCard: string = '0 ';
  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private router: Router,
    private productivityService: ProductivityService,
    
  ) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.sharedStateService.toggleSidenavVisible(true);
    this.GetBoardDirectorsReports();
  }

  GetBoardDirectorsReports() {
    this.productivityService.get('get-board-directors-report').subscribe({
      next: (data: any) => {
        this.dataSource = data.data.data;
        this.doughnutChartData.labels = data.data.grafica.map(
          (r: any) => r.nombre
        );
        this.doughnutChartData.datasets[0].data = data.data.grafica.map(
          (r: any) => r.porcentaje
        );
        if (this.chart) {
          this.chart.update();
        }
        this.objativesCard = data.data.card.total;
        this.growthCard = parseFloat(data.data.card.porcentaje).toFixed(2);
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar el reporte de junta directiva:',
          error
        );
      },
    });
  }

  applyFilter(event: Event) {}

  onEditAction(event: any) {
    event.estado = event.estado == 'activo' ? true : false;
    const dialogRef = this.dialog.open(CreateBoardDirectorsReportComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerFCTipo().subscribe({
          next: (data) => {
            this.GetBoardDirectorsReports();
          },
          error: (error) => {
            this.auxService.AlertError(
              'Error al cargar los tipos de categoría (flujo de caja):',
              error
            );
          },
        });
      }
    });
  }

  async onDeleteAction(event: any) {
    console.log('event ', event);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-board-directors-report', event.idInforme)
        .subscribe(async (data: any) => {
          this.auxService.cerrarVentanaCargando();
          if (data.success == true) {
            await this.auxService.AlertSuccess('Ok', data.message);
            this.ngOnInit();
          } else {
            await this.auxService.AlertError('Error', data.message);
            //this.getBalance();
          }
        });
    }
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateBoardDirectorsReportComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.configService.ObtenerFCTipo().subscribe({
          next: (data) => {
            this.GetBoardDirectorsReports();
          },
          error: (error) => {
            this.auxService.AlertError(
              'Error al crear el reporte de junta directiva:',
              error
            );
          },
        });
      }
    });
  }
}
