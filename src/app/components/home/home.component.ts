import { Component, ViewChild } from '@angular/core';
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
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../shared/shared.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';



export interface UserData {
  usuario: string;
  nombre: string;
  apellido: string;
  sexo: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

  constructor(private sharedStateService: SharedStateService, private permisosService: PermisosService
    ,private auxService: AuxService, private router: Router
  ){}

  displayedColumns: string[] = ['empresa'];
  dataSource = new MatTableDataSource<UserData>([]);

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

 
  onGoAction(element: any) {
  
    this.permisosService.getLoginEmpresas(element.idEmpresa).subscribe({
      next:(data) =>{

        if(data.success){

          if(!data.warning){
            
            this.router.navigate(['/import']);
        
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


