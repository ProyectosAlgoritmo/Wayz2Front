import { Component, OnInit } from '@angular/core';
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
import { EditbusinessunitComponent } from './editbusinessunit/editbusinessunit.component';
import { CreatebusinessunitComponent } from './createbusinessunit/createbusinessunit.component';


@Component({
  selector: 'app-businessunit',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './businessunit.component.html',
  styleUrls: ['./businessunit.component.css']
})
export class BusinessunitComponent implements OnInit {
  

  displayedColumns: string[] = ['clase', 'nombre'];
  columnNames = {
    nombreCliente: 'Clase',
    tipoIdentificacion: 'Nombre tipo negocio'
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService, private configService: ConfigService, private auxService: AuxService, public dialog: MatDialog )  {
    this.sharedStateService.updateSuggestedQuestions([]);
  
   }

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.ObtenerBusinessUnits().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource = Array.isArray(data.data) ? data.data : [];

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Unidades de negocio",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 
       
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        //catchError(this.handleError)
        this.auxService.AlertError('Error al cargar unidades de negocio:', error);
      },
    }); 
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditbusinessunitComponent, {
        data: { idUnidad: event.idUnidad }

      });

    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerBusinessUnits().subscribe({
              next: (data) => {

                this.dataSource = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar las lineas de negocio:', error);
              }
            });
          }
    });

}


CreateAction() {
  console.log(event); 
  
  const dialogRef = this.dialog.open(CreatebusinessunitComponent); 
  
  dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el resultado es true, se vuelve a obtener la lista de clientes
          this.configService.ObtenerBusinessUnits().subscribe({
            next: (data) => {

              this.dataSource = data.data;
              this.auxService.cerrarVentanaCargando();
            },
            error: (error) => {
              this.auxService.AlertError('Error al cargar las lineas de negocio:', error);
            }
          });
        }
  });

}


}
