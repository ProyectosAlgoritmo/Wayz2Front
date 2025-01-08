import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedStateService } from '../../../services/shared-state.service';
import { ConfigService } from '../../../services/config.service';
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

import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { EditMachineComponent } from './edit-machine/edit-machine.component';

@Component({
  selector: 'app-machine',
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
  templateUrl: './machine.component.html',
  styleUrls: ['./machine.component.css'],
})
export class MachineComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  columnNames = {
    name: 'Name',
  };
  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private configService: ConfigService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.originalDataSource = [...this.dataSource];

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.getMachines().subscribe({
      next: (data:any) => {
        if (data.success) {
          this.auxService.cerrarVentanaCargando();

          if (!data.warning) {
            this.dataSource = Array.isArray(data.data) ? data.data : [];
          } else {
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning('machines', data.message);
          }
        } else {
          this.auxService.ventanaCargando();
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.cerrarVentanaCargando();
        console.log(error.status);
        this.auxService.AlertError('Error al cargar los clientes:', error);
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

  CreateAction() {
    const dialogRef = this.dialog.open(EditMachineComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getmachine();
      }
    });
  }

  getmachine() {
    this.auxService.ventanaCargando();
    this.configService.getMachines().subscribe({
      next: (data:any) => {
        this.dataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los clientes:', error);
      },
    });
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditMachineComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getmachine();
      }
    });
  }
}
