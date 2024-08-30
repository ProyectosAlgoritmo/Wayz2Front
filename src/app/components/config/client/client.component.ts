import { Component, Input, OnInit } from '@angular/core';
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
import { EditclientComponent } from './editclient/editclient.component';
import { TableWithRowsChildComponent } from '../../shared/table-with-rows-child/table-with-rows-child.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule, TableWithRowsChildComponent
  ],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  displayedColumns: string[] = ['nombreCliente', 'tipoIdentificacion', 'identificacion', 'pais', 'ciudad'];
  columnNames = {
    nombreCliente: 'Nombre del cliente',
    tipoIdentificacion: 'tipo de identificación'
  };
  dataSource = new MatTableDataSource<any>([]);
  dataForTable: any[] = [];

  constructor(private sharedStateService: SharedStateService, private configService: ConfigService, private auxService: AuxService, public dialog: MatDialog ) { }

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.sharedStateService.getDataStructure1().subscribe(data => { 
      this.dataForTable = data;
    });
    this.auxService.ventanaCargando();
    this.configService.ObtenerClients().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource.data = data.data;

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Clientes",data.message); 

          }

        }
        else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Error",data.message); 

        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        console.log(error.status); 
        this.auxService.AlertError('Error al cargar los clientes:', error);
      },
    }); 
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditAction(event: any) {
    const dialogRef = this.dialog.open(EditclientComponent, {
        data: { idclient: event.idCliente }

      });

    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerClients().subscribe({
              next: (data) => {

                this.dataSource.data = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar los clientes:', error);
              }
            });
          }
    });

}

}
