import { Component, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';
import { SharedStateService } from '../../services/shared-state.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { TableComponent } from '../shared/table/table.component';

export interface UserData {
  Formulario: string;
  prueba: string;
  apellido: string;
  sexo: string;
}


const USERS_DATA: UserData[] = [
  {Formulario: 'jperez', prueba: 'Juan', apellido: 'Perez', sexo: 'Masculino'},
  {Formulario: 'mgomez', prueba: 'Martin', apellido: 'Gomez', sexo: 'Masculino'},
  {Formulario: 'ngarcia', prueba: 'Nicolas', apellido: 'Garcia', sexo: 'Masculino'},
  {Formulario: 'naliaga', prueba: 'Nicolle', apellido: 'Aliaga', sexo: 'Femenino'},
  {Formulario: 'jgonzalez', prueba: 'Janet', apellido: 'Gonzalez', sexo: 'Femenino'},
  {Formulario: 'tmarcuzzi', prueba: 'Tomas', apellido: 'Marcuzzi', sexo: 'Masculino'},

  {Formulario: 'naliaga', prueba: 'Nicolle', apellido: 'Aliaga', sexo: 'Femenino'},
  {Formulario: 'jgonzalez', prueba: 'Janet', apellido: 'Gonzalez', sexo: 'Femenino'},
  {Formulario: 'tmarcuzzi', prueba: 'Tomas', apellido: 'Marcuzzi', sexo: 'Masculino'},

  {Formulario: 'naliaga', prueba: 'Nicolle', apellido: 'Aliaga', sexo: 'Femenino'},
  {Formulario: 'jgonzalez', prueba: 'Janet', apellido: 'Gonzalez', sexo: 'Femenino'},
  {Formulario: 'tmarcuzzi', prueba: 'Tomas', apellido: 'Marcuzzi', sexo: 'Masculino'},

];


@Component({
  selector: 'app-import',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule,
    NzIconModule
  ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {

  displayedColumns: string[] = ['Formulario'];
  dataSource = new MatTableDataSource<UserData>([]);

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private sharedStateService: SharedStateService){}; 

  ngOnInit(): void {

    
    this.sharedStateService.toggleSidenavVisible(true);

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.dataSource.data = USERS_DATA;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
