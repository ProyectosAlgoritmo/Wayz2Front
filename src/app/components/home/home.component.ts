import { Component, ViewChild } from '@angular/core';
import { LateralmenuComponent } from '../shared/lateralmenu/lateralmenu.component';
import { SharedStateService } from '../../services/shared-state.service';
import { PermisosService } from '../../services/permisos.service';
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



export interface UserData {
  usuario: string;
  nombre: string;
  apellido: string;
  sexo: string;
}

const USERS_DATA: UserData[] = [
  {usuario: 'jperez', nombre: 'Juan', apellido: 'Perez', sexo: 'Masculino'},
  {usuario: 'mgomez', nombre: 'Martin', apellido: 'Gomez', sexo: 'Masculino'},
  {usuario: 'ngarcia', nombre: 'Nicolas', apellido: 'Garcia', sexo: 'Masculino'},
  {usuario: 'naliaga', nombre: 'Nicolle', apellido: 'Aliaga', sexo: 'Femenino'},
  {usuario: 'jgonzalez', nombre: 'Janet', apellido: 'Gonzalez', sexo: 'Femenino'},
  {usuario: 'tmarcuzzi', nombre: 'Tomas', apellido: 'Marcuzzi', sexo: 'Masculino'},

  {usuario: 'ngarcia', nombre: 'Nicolas', apellido: 'Garcia', sexo: 'Masculino'},
  {usuario: 'naliaga', nombre: 'Nicolle', apellido: 'Aliaga', sexo: 'Femenino'},
  {usuario: 'jgonzalez', nombre: 'Janet', apellido: 'Gonzalez', sexo: 'Femenino'},
  {usuario: 'tmarcuzzi', nombre: 'Tomas', apellido: 'Marcuzzi', sexo: 'Masculino'},
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LateralmenuComponent, MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

  constructor(private sharedStateService: SharedStateService, private permisosService: PermisosService
    ,private auxService: AuxService, private router: Router
  ){}

  displayedColumns: string[] = ['nombreEmpresa', 'acciones'];
  dataSource = new MatTableDataSource<UserData>(USERS_DATA);

  @ViewChild(MatSort) sort: MatSort | undefined;

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(false);

    this.permisosService.ObtenerEmpresas().subscribe({
      next:(data) =>{

        if(data.success){

          if(!data.warning){

            console.log(data);
            this.dataSource.data = data.data;
            console.log(this.dataSource.data); 

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Tus empresas",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 

        }
      },
      error: (error) => {
        console.log(error.message);
      },
    }); 
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getLoginEmpresas(idEmpresa: number): void {
    this.permisosService.getLoginEmpresas(idEmpresa).subscribe({
      next:(data) =>{

        if(data.success){

          if(!data.warning){
            
            this.router.navigate(['/dashboard']);
        
          }
          else{
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Tus empresas",data.message); 
          }

        }
        else{
            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    }); 
  }
}


