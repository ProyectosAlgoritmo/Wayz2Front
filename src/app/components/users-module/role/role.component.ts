import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';
import { UsersService } from '../../../services/users.service';
import { CreateRoleComponent } from './create-role/create-role.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
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
export class RoleComponent implements OnInit {
  displayedColumns: string[] = [
    'rol',
  ];

  // Nombres amigables de las columnas
  columnNames = {
    rol: 'Rol',
  };

  dataSource: any[] = [];
  dataForTable: any[] = [];
  originalDataSource: any[] = [];

  constructor(
    private sharedStateService: SharedStateService,
    private usersService: UsersService,
    private auxService: AuxService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  ngOnInit(): void {
    this.GetRol();
  }

  GetRol() {
    this.auxService.ventanaCargando();
    this.usersService.get('get-roles').subscribe({
      next: (data) => {
        this.dataSource = data.data;
        this.originalDataSource = data.data;
        this.auxService.cerrarVentanaCargando();
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los usuarios:', error);
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
    const dialogRef = this.dialog.open(CreateRoleComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetRol();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateRoleComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetRol();
      }
    });
  }
}
