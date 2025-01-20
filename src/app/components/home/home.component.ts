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
import { MatDialog } from '@angular/material/dialog';
import { CreateEnterpriseComponent } from '../create-enterprise/create-enterprise.component';
import { da, tr } from 'date-fns/locale';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { set } from 'date-fns';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule, NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  

  constructor(private sharedStateService: SharedStateService, private permisosService: PermisosService
    ,private auxService: AuxService, private router: Router, public dialog: MatDialog,
    public authService: AuthService
  ){
    this.sharedStateService.updateSuggestedQuestions([]);
  }

  displayedColumns: string[] = ['empresa'];
  dataSource: any[] = [];
  isCreateEnterprise = false;
  isUpdateEnterprise = false;

  @ViewChild(MatSort) sort: MatSort | undefined;

  ngOnInit(): void {
    this.sharedStateService.toggleSidenavVisible(false);
    this.sharedStateService.statecompanyVisible(false);
    const rol = localStorage.getItem("rol");

    if (rol !== null) {
      if (rol === "SuperAdministrador") {
        this.isCreateEnterprise = true;
        this.isUpdateEnterprise = true;
      }
      if (rol === "AdministradorEmpresa" || rol === "Administrador") {
        this.isCreateEnterprise = false;
        this.isUpdateEnterprise = true;
      }
    } else {
      this.isCreateEnterprise = false;
      this.isUpdateEnterprise = false;
    }

    this.auxService.ventanaCargando();
    this.permisosService.ObtenerEmpresas().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource = Array.isArray(data.data) ? data.data : [];

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
      },
    }); 
   
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(CreateEnterpriseComponent, {
      data: { idclient: event.idEmpresa }

    });
  }

  CreateAction() {
    const dialogRef = this.dialog.open(CreateEnterpriseComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
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
            localStorage.setItem('idEmpresa', element.idEmpresa);
            
            //localStorage.setItem('permisos', JSON.stringify(data.data.permisos));
            let permisos = this.authService.getPermisos();
            if(permisos != null){
              let url = permisos[0].permisosHijos[0].url;
              if(url == null){
                this.router.navigate(['/import']);
              }else{
                this.router.navigate([url.toString()]);
                // setTimeout(() => {
                //   location.reload();
                // }, 1);
              }
            }
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
      },
    }); 
  }

  
}


