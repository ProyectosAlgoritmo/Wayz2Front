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

  constructor(
    private sharedStateService: SharedStateService,
    private financialperformanceService: financialperformanceService,
    private auxService: AuxService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.financialperformanceService.GetData('Get-expenses').subscribe({
      next: (data) => {
        if (data.success) {
          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {
            this.dataSource = data.data;
          } else {
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning('Egresos', data.message);
          }
        } else {
          this.auxService.ventanaCargando();
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        console.log(error.status);
        this.auxService.AlertError('Error al cargar los egresos:', error);
      },
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
        this.financialperformanceService.GetData('Get-expenses').subscribe({
          next: (data) => {
            this.dataSource = data.data;
            this.auxService.cerrarVentanaCargando();
          },
          error: (error) => {
            this.auxService.AlertError('Error al cargar los egresos:', error);
          },
        });
      }
    });
  }
}
