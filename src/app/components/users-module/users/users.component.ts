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
    'rol',
  ];

  // Nombres amigables de las columnas
  columnNames  = {
    nombre: 'First name',
    apellido: 'Last name',
    correoElectronico: 'Email',
    telefono: 'Phone',
    rol: 'Role',
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


  onEditAction(event: any) {
    event.bActivo = event.bActivo === 'active' ? true : false;
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
