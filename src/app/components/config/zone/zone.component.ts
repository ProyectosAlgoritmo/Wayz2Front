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
import { EditzoneComponent } from './editzone/editzone.component';
import { CreatezoneComponent } from './createzone/createzone.component';

@Component({
  selector: 'app-zone',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  templateUrl: './zone.component.html',
  styleUrl: './zone.component.css'
})
export class ZoneComponent {

  displayedColumns: string[] = ['nombreZona', 'nombreTipoZona'];
  columnNames = {
    nombreZona: 'Nombre de la zona',
    nombreTipoZona: 'Tipo de zona'
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService, private configService: ConfigService, private auxService: AuxService, public dialog: MatDialog )  { this.sharedStateService.updateSuggestedQuestions([]);
    
   }


  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.ObtenerZones().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource =Array.isArray(data.data) ? data.data : [];

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
    const dialogRef = this.dialog.open(EditzoneComponent, {
        data: { idZona: event.idZona }

      });

    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerZones().subscribe({
              next: (data) => {

                this.dataSource = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar las zonas', error);
              }
            });
          }
    });

}

CreateAction() {
  console.log(event); 
  
  const dialogRef = this.dialog.open(CreatezoneComponent);

  dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Si el resultado es true, se vuelve a obtener la lista de clientes
          this.configService.ObtenerZones().subscribe({
            next: (data) => {

              this.dataSource = data.data;
              this.auxService.cerrarVentanaCargando();
            },
            error: (error) => {
              this.auxService.AlertError('Error al cargar las zonas:', error);
            }
          });
        }
  });

}

}
