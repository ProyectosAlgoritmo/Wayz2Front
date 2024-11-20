import { Component, OnInit } from '@angular/core';
import { SharedStateService } from '../../../services/shared-state.service';
import { AuxService } from '../../../services/aux-service.service';
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
import { SharedModule } from '../../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { financialperformanceService } from '../../../services/financialperformance.service';
import { EditexpenseComponent } from './editexpense/editexpense.component';

@Component({
  selector: 'app-expenses',
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
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css',
})
export class ExpensesComponent {
  displayedColumns: string[] = [
    'nombreUnidad',
    'nombreTipoEgreso',
    'conceptoEgreso',
    'valorEgresoReal',
    'valorEgresoProyectado',
    'mes',
  ];
  columnNames = {
    nombreUnidad: 'Nombre de la unidad',
    nombreTipoEgreso: 'Tipo de egreso',
    conceptoEgreso: 'Concepto de egreso',
    valorEgresoReal: 'Valor real',
    valorEgresoProyectado: 'Valor proyectado',
    mes: 'Mes',
  };
  dataSource: any[] = [];
  dates: any = {};

  constructor(
    private sharedStateService: SharedStateService,
    private financialperformanceService: financialperformanceService,
    private auxService: AuxService,
    public dialog: MatDialog
  ) {}

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

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);
    const currentYear = new Date().getFullYear(); // Obtiene el año actual
    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };

    this.auxService.ventanaCargando();
    this.cargarEgresos(this.dates);
    this.updateQuestions();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.auxService.ventanaCargando();
    this.cargarEgresos(this.dates); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  cargarEgresos(dates: string[]){

    this.financialperformanceService.GetDatapost("Get-expenses", dates ).subscribe({
      next: (data) => {

        this.dataSource = Array.isArray(data.data) ? data.data : [];
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los egresos:', error);
      }
    });

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter((item) =>
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditexpenseComponent, {
      data: { IdEgreso: event.idEgreso },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Si el resultado es true, se vuelve a obtener la lista de clientes
        this.cargarEgresos(this.dates);
     
      }
    });
  }
}
