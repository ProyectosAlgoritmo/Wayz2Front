import { Component, OnInit } from '@angular/core';
import { SharedStateService } from '../../../services/shared-state.service';
import { AuxService } from '../../../services/aux-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { financialperformanceService } from '../../../services/financialperformance.service';
import { EditincomeComponent } from './editincome/editincome.component';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { format } from 'date-fns'; // Usar date-fns para formatear fechas


@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ MatCardModule, SharedModule, NzIconModule
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {

  displayedColumns: string[] = ['nombreCliente', 'nombreVendedor', 'codigoProducto', 'conceptoIngreso', 'cantidadReal', 'cantidadProyectada', 'valorIngresoReal', 'valorIngresoProyectado', 'mes'];
  columnNames = {
    nombreCliente: 'Nombre del cliente',
    nombreVendedor: 'Vendedor', 
    codigoProducto: 'Codigo del producto', 
    conceptoIngreso: 'Concepto de ingreso', 
    cantidadReal: 'Cantidad real', 
    cantidadProyectada: 'Cantidad Proyectada',
    valorIngresoReal: 'Ingreso real', 
    valorIngresoProyectado: 'Ingreso Proyectado'
  };
  dataSource: any[] = [];
  dates: any = {};

  constructor(private sharedStateService: SharedStateService, private financialperformanceService: financialperformanceService, private auxService: AuxService, public dialog: MatDialog ) {
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };

   }

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();

    this.cargaringresos(this.dates); 
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.auxService.ventanaCargando();
    this.cargaringresos(this.dates); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
  }

  cargaringresos(dates: string[]){

    this.financialperformanceService.GetDatapost("Get-income", dates ).subscribe({
      next: (data) => {

        this.dataSource = Array.isArray(data.data) ? data.data : [];
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los clientes:', error);
      }
    });

  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditincomeComponent, {
      data: { idingreso: event.idIngreso }

    });

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el resultado es true, se vuelve a obtener la lista de clientes
          this.cargaringresos(this.dates); 
        }
  });
  }

}

