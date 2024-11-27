import { Component, OnInit, Provider, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  CloudDownloadOutline,
  CloudUploadOutline,
  PlayCircleOutline,
  EyeOutline,
  EditOutline,
} from '@ant-design/icons-angular/icons';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { SharedModule } from '../../shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AuxService } from '../../../services/aux-service.service';
import { ProductivityService } from '../../../services/productivity.service';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateProjectStatusComponent } from './create-project-status/create-project-status.component';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { CardPercentageComponent } from '../../shared/card-percentage/card-percentage.component';
import { BaseChartDirective } from 'ng2-charts';
import { NzCardModule } from 'ng-zorro-antd/card';
import { registerables } from 'chart.js';
import { SharedStateService } from '../../../services/shared-state.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true,
  providers: [
    {
      provide: NZ_ICONS,
      useValue: [
        CloudDownloadOutline,
        CloudUploadOutline,
        PlayCircleOutline,
        EyeOutline,
        EditOutline,
      ],
    },
  ],
  imports: [
    TableWithRowsChildComponent,
    FormsModule,
    NgFor,
    NzInputModule,
    MatToolbarModule,
    NzOptionComponent,
    NzSelectModule,
    NzIconModule,
    SharedModule,
    BaseChartDirective,
    NzCardModule,
    CardPercentageComponent,
  ],
})
export class ProjectsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  [x: string]: any;
  dataForTable: any[] = [];
  dateYear: any[] = [];
  searchValue: string = '';
  emitEditToParent = false;
  constructor(
    public dialog: MatDialog,
    private auxService: AuxService,
    private productivityService: ProductivityService,
    private sharedStateService: SharedStateService
  ) {
    Chart.register(...registerables);
  }

  mainTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Proyecto', field: 'nombre', sortDirection: null },
    { title: 'Lider de proyecto', field: 'liderProyecto', sortDirection: null },
    { title: 'Zona', field: 'zona', sortDirection: null },
    { title: 'Unidad', field: 'unidad', sortDirection: null },
    { title: 'Porcentaje avance Proyectado', field: 'porcentajeavanceProyectado', sortDirection: null },
    { title: 'Porcentaje avance real', field: 'porcentajeavanceReal', sortDirection: null },
    { title: 'Etapa', field: 'etapa', sortDirection: null },
    { title: 'Estado', field: 'estado', sortDirection: null },
    { title: 'Fecha de inicio', field: 'fechaInicio', sortDirection: null },
    { title: 'Fecha final', field: 'fechaFinal', sortDirection: null },
    { title: 'Estrategico', field: 'estrategico', sortDirection: null },
  ];

  subTableColumns = [
    { title: 'Acciones', field: 'Acciones', sortDirection: null },
    { title: 'Nombre', field: 'nombre', sortDirection: null },
    { title: 'Descripcion', field: 'descripcion', sortDirection: null },
    { title: 'Comentario', field: 'comentario', sortDirection: null },
    { title: 'estado', field: 'estado', sortDirection: null },
    { title: 'Etapa', field: 'etapa', sortDirection: null },
    { title: 'Porcentaje proyectado', field: 'porcentajeProyectado', sortDirection: null },
    { title: 'Porcentaje real', field: 'porcentajeReal', sortDirection: null },
    { title: 'Responsable', field: 'responsable', sortDirection: null },
    { title: 'Fecha de revision', field: 'fechaRevision', sortDirection: null },
  ];

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
          '#9400D3'  // Violeta oscuro
        ]
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


  iconTheme: 'user' | null | undefined = 'user';
  objativesCard: number = 0;
  titleCard: string = 'Objetivos Cumplidos';
  growthCard: string = '0 ';

  onSearchChange(): void {
    this.auxService.updateSearch(this.searchValue);
  }

  updateQuestions() {
    const newQuestions = [
      {
        question: '¿Cuál es el estado actual de los proyectos estratégicos, incluyendo porcentaje de avance, proyectos completados, en curso y retrasados?',
        api: 'Productivity/get-projects-ia'
      },
      {
        question: "¿Qué proyectos estratégicos están fuera de su cronograma y cuál es la desviación promedio respecto al plan inicial?",
        api: 'Productivity/get-projects-ia'
      },
      {
        question: "¿Qué factores están contribuyendo más al retraso de los proyectos estratégicos y cómo podrían mitigarse?",
        api: 'Productivity/get-projects-ia'
      },
      {
        question: "¿Qué proyectos estratégicos tienen mayores riesgos identificados y cuál es su probabilidad de impacto en la ejecución?",
        api: 'Productivity/get-projects-ia'
      },
      {
        question: "¿Qué proyectos están en riesgo de no completarse según el cronograma actual y cuál es el plan de recuperación sugerido?",
        api: 'Productivity/get-projects-ia'
      }
    ];
    // Actualizar las preguntas sugeridas usando el servicio compartido
    this.sharedStateService.updateSuggestedQuestions(newQuestions);
    
  }

  ngOnInit() {
    this.getProjects();
    this.sharedStateService.toggleSidenavVisible(true);
    this.updateQuestions();
    // this.productivityService.getDataStructure1().subscribe((data) => {
    //   this.dataForTable = data;
    // });
  }

  getProjects() {
    this.auxService.ventanaCargando();
    this.productivityService.get('get-projects').subscribe(async (data) => {
      this.dataForTable = data.data.data;
      this.doughnutChartData.labels = data.data.grafica.map((r: any) => r.nombre);
      this.doughnutChartData.datasets[0].data = data.data.grafica.map(
        (r: any) => r.porcentaje
      );
      if (this.chart) {
        this.chart.update();
      }
      this.objativesCard = data.data.card.total;
      this.growthCard = parseFloat(data.data.card.porcentaje).toFixed(2);
      this.auxService.cerrarVentanaCargando();
    });
  }
  

  onEditClicked(data: any) {
    this.onEditAction(data);
  }

  onEditAction(event: any) {
    event.estado = event.estado == 'activo' ? true : false;
    event.estrategico = event.estrategico == 'activo' ? true : false;
    if (event.table == 'principal') {
      const dialogRef = this.dialog.open(CreateProjectComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getProjects();
        }
      });
    }

    if (event.table == 'subTable') {
      const dialogRef = this.dialog.open(CreateProjectStatusComponent, {
        data: event,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getProjects();
        }
      });
    }
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateProjectComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjects();
      }
    });
  }

  CreateProjectStatus() {
    const dialogRef = this.dialog.open(CreateProjectStatusComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProjects();
      }
    });
  }

  onDeleteAction(event: any) {
    console.log('event ', event);
    if (event.table == 'principal') {
      this.deleteProject(event);
    }
    if (event.table == 'subTable') {
      this.deleteProjectStatus(event);
    }
  }

  async deleteProject(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-project', event.id)
        .subscribe(async (data) => {
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

  async deleteProjectStatus(event: any) {
    console.log('event ', event.id);
    const result = await this.auxService.AlertConfirmation(
      'Seguro que desea eliminar este registro?',
      undefined
    );
    if (result.isConfirmed) {
      this.auxService.ventanaCargando();
      this.productivityService
        .Delete('delete-project-state', event.id)
        .subscribe(async (data) => {
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

}
