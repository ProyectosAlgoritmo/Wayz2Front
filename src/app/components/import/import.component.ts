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
import { ImportService } from '../../services/import.service';
import { FileUploadImportComponent } from './file-upload-import/file-upload-import.component';
import { MatDialog } from '@angular/material/dialog';

export interface UserData {
  Formulario: string;
  Carpeta: string; 
  modeldata: string; 
  storedprocedure: string; 
}


const USERS_DATA: UserData[] = [
  {Formulario: 'Clientes', Carpeta: 'Administracion/', modeldata: '@ModeloEntradaClientes', storedprocedure: '[administracion].[ImportClientes]'},
  {Formulario: 'Productos y servicios', Carpeta: 'Administracion/', modeldata: '@ModeloProductosServicios', storedprocedure: '[administracion].[ImportProductServices]'},
  {Formulario: 'Vendedores', Carpeta: 'Administracion/', modeldata: '@ModeloVendedores', storedprocedure: '[administracion].[ImportVendedores]'},
  {Formulario: 'Ingresos reales', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaIngresosReales', storedprocedure: '[desempenofinanciero].[ImportIngresosreales]'},
  {Formulario: 'Ingresos proyectados', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaIngresosProyectados', storedprocedure: '[desempenofinanciero].[ImportIngresosproyectados]'},
  {Formulario: 'Egresos reales', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaEgresosReales', storedprocedure: '[desempenofinanciero].[ImportEgresosreales]'},
  {Formulario: 'Egresos proyectados', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaEgresosProyectados', storedprocedure: '[desempenofinanciero].[ImportEgresosproyectados]'},
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

  constructor(private sharedStateService: SharedStateService, private importService: ImportService, public dialog: MatDialog){}; 

  
  
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

  onImportAction(element: any) {

    const additionalData = element.Formulario;
    const carpeta = element.Carpeta;
    const modeldata = element.modeldata;
    const storedprocedure = element.storedprocedure;

    const dialogRef = this.dialog.open(FileUploadImportComponent, {
      data: { additionalData, carpeta, modeldata, storedprocedure }
    });

    //dialogRef.afterClosed().subscribe(result => {
    //  if (result) {
     //   console.log('File selected:', result);
     //   this.uploadFile(result); // Llama a tu método para subir el archivo
     // }
    //});


   // this.importService.ImportDesempenofinanciero(fileUrl, bucketName, objectName).subscribe(response => {
   //   console.log(response);
    //});

  }

  uploadFile(file: File): void {
    // Lógica para subir el archivo
    console.log('Uploading file:', file);
  }
  

}
