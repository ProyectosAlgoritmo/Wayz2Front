import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedStateService } from '../../services/shared-state.service';
import { ConfigService } from '../../services/config.service';
import { AuxService } from '../../services/aux-service.service';
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
import { SharedModule } from '../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialog } from '@angular/material/dialog';
import { TableWithRowsChildComponent } from '../shared/table-with-rows-child/table-with-rows-child.component';
import { EditclientComponent } from '../config/client/editclient/editclient.component';
import { UsersService } from '../../services/users.service';
import { Create } from 'powerbi-client';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
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
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'apellido',
    'correoElectronico',
    'telefono',
    'username',
    'tipoIdentificacion',
    'identificacion',
    'fechaNacimiento',
    'fechaIngresoEmpresa',
    'idRol',
    'rol',
  ];

  // Nombres amigables de las columnas
  columnNames = {
    nombre: 'Nombre',
    apellido: 'Apellido',
    correoElectronico: 'Correo electrónico',
    telefono: 'Teléfono',
    username: 'Nombre de usuario',
    tipoIdentificacion: 'Tipo de identificación',
    identificacion: 'Identificación',
    fechaNacimiento: 'Fecha de nacimiento',
    fechaIngresoEmpresa: 'Fecha de ingreso ',
    idRol: 'ID del Rol',
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
    this.GetUsers();
  }

  GetUsers() {
    this.auxService.ventanaCargando();
    this.usersService.get('get-users').subscribe({
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
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: event,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetUsers();
      }
    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateUserComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetUsers();
      }
    });
  }
}
