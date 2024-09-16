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
import { EditproductsservicesComponent } from './editproductsservices/editproductsservices.component';


@Component({
  selector: 'app-productsservices',
  templateUrl: './productsservices.component.html',
  standalone: true,
  imports: [MatToolbarModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule
    , MatButtonModule, MatIconModule, MatCardModule, SharedModule, NzInputModule, NzIconModule
  ],
  styleUrls: ['./productsservices.component.css']
})
export class ProductsservicesComponent implements OnInit {

  displayedColumns: string[] = ['clase', 'unidadNombre', 'nombre','codigoReferencia', 'valorVenta', 'costoProduccion'];
  columnNames = {
    clase: 'Clase',
    unidadNombre: 'Unidad',
    Nombre: 'Nombre', 
    codigoReferencia: 'Codido', 
    valorVenta: 'Valor venta',
  };
  dataSource: any[] = [];

  constructor(private sharedStateService: SharedStateService, private configService: ConfigService, private auxService: AuxService, public dialog: MatDialog )  { }
 

  ngOnInit(): void {

    this.sharedStateService.toggleSidenavVisible(true);

    this.auxService.ventanaCargando();
    this.configService.ObtenerProductsServices().subscribe({
      next:(data) =>{

        if(data.success){

          this.auxService.cerrarVentanaCargando();

          if(!data.warning){

            this.dataSource = data.data;

          }
          else{

            this.auxService.ventanaCargando();
            this.auxService.AlertWarning("Productos y servicios",data.message); 

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
        this.auxService.AlertError('Error al cargar productos y servicios:', error);
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
    console.log(event); 
    const dialogRef = this.dialog.open(EditproductsservicesComponent, {
        data: { idProductoServicio: event.idProductoServicio }

      });

    dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Si el resultado es true, se vuelve a obtener la lista de clientes
            this.configService.ObtenerProductsServices().subscribe({
              next: (data) => {

                this.dataSource = data.data;
                this.auxService.cerrarVentanaCargando();
              },
              error: (error) => {
                this.auxService.AlertError('Error al cargar las productos y servicios:', error);
              }
            });
          }
    });

}

}
