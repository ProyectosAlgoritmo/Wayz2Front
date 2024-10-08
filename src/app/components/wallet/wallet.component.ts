import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

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
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { TableWithRowsChildComponent } from '../shared/table-with-rows-child/table-with-rows-child.component';
import { SharedStateService } from '../../services/shared-state.service';
import { AuxService } from '../../services/aux-service.service';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { WalletService } from '../../services/wallet.service';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css'],
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
  ],
})
export class WalletComponent implements OnInit {
  displayedColumns: string[] = [
    'fecha',
    'numeroFactura',  // Cambié de 'referenciaFactura' a 'numeroFactura' según tu modelo
    'unidad',
    'cliente',
    'fechaEmision',
    'fechaVencimiento',
    'valor',
    'antiguedadDias',  // Agregado campo de antigüedad si es necesario
    'valorCarteraCorriente',  // Campo agregado de acuerdo a tu modelo
    'valor30Dias',  // Campo agregado de acuerdo a tu modelo
    'valor3160Dias',  // Campo agregado de acuerdo a tu modelo
    'valor6190Dias',  // Campo agregado de acuerdo a tu modelo
    'valorMayor91Dias',  // Campo agregado de acuerdo a tu modelo
    'totalCartera',  // Agregado para mostrar el total de la cartera
  
];

// Nombres amigables de las columnas
columnNames = {
    fecha: 'Fecha',
    numeroFactura: 'Número de Factura',  // Ajustado a tu modelo
    unidad: 'Unidad',
    cliente: 'Cliente',
    fechaEmision: 'Fecha de Emisión',
    fechaVencimiento: 'Fecha de Vencimiento',
    valor: 'Valor',
    antiguedadDias: 'Antigüedad Días',  // Nuevo campo de antigüedad
    valorCarteraCorriente: 'Valor Cartera Corriente',  // Nuevo campo de valor corriente
    valor30Dias: 'Valor a 30 Días',  // Campo nuevo
    valor3160Dias: 'Valor de 31 a 60 Días',  // Campo nuevo
    valor6190Dias: 'Valor de 61 a 90 Días',  // Campo nuevo
    valorMayor91Dias: 'Valor Mayor a 91 Días',  // Campo nuevo
    totalCartera: 'Total Cartera',  // Agregado el total
};


  dates: any = {};
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private walletService: WalletService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
    const currentYear = new Date().getFullYear(); // Obtiene el año actual

    this.dates = {
      FechaInicio: `${currentYear}-01-01`, // Establece la fecha de inicio al 1 de enero del año actual
      FechaFin: `${currentYear}-12-31`     // Establece la fecha de fin al 31 de diciembre del año actual
    };
  }

  ngOnInit(): void {
    this.GetWallets();
  }

  handleDateSelected(datesselect: string[]): void {
    this.dates = datesselect;
    this.GetWallets(); 
    // Aquí puedes manejar las fechas seleccionadas
  }

  GetWallets() {
    this.auxService.ventanaCargando();
    this.walletService.post('get-wallets',this.dates).subscribe({
      next: (data) => {
        this.dataSource = data.data;
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los datos:', error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (!filterValue) {
      // Si no hay filtro, restaura los datos originales
      this.dataSource = [...this.originalDataSource];
    } else {
      this.dataSource = this.originalDataSource.filter((item) => {
        return this.displayedColumns.some((column) => {
          const columnValue = item[column];
          return (
            columnValue &&
            columnValue.toString().toLowerCase().includes(filterValue)
          );
        });
      });
    }
  }

  onEditAction(event: any) {
    event.bActivo = event.bActivo === 'activo' ? true : false;
    const dialogRef = this.dialog.open(CreateWalletComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetWallets();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateWalletComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetWallets();
      }
    });
  }

  // Función para eliminar un usuario
  onDeleteAction(event: any) {
    this.auxService.ventanaCargando();
    this.walletService.Delete('delete-wallet', event.idUsuario).subscribe({
      next: async (data: any) => {
        this.auxService.cerrarVentanaCargando();
        if (data.success) {
          await this.auxService.AlertSuccess(
            'Registro eliminado correctamente',
            data.message
          );
          this.GetWallets();
        } else {
          this.auxService.AlertWarning(
            'Error al eliminar el registro',
            data.message
          );
        }
      },
      error: (error: any) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al eliminar el registro', error.message);
      },
    });
  }
}
