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
  dataSource: any[] = [];

  @ViewChild(MatSort) sort: MatSort | undefined;

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(false);


    this.auxService.ventanaCargando();
    this.permisosService.ObtenerEmpresas().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource = data.data;

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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
  }
 
  onGoAction(element: any) {
  
    this.permisosService.getLoginEmpresas(element.idEmpresa).subscribe({
      next:(data) =>{

        if(data.success){

          if(!data.warning){

            sessionStorage.removeItem('token');
            sessionStorage.setItem('token', data.data.payload);
            
            //localStorage.setItem('permisos', JSON.stringify(data.data.permisos));
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


