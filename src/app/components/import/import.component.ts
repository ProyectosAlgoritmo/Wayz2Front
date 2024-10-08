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
  modelImport: string; 
}


const USERS_DATA: UserData[] = [
  {Formulario: 'Clientes', Carpeta: 'Administracion/', modeldata: '@ModeloEntradaClientes', storedprocedure: '[administracion].[ImportClientes]', modelImport: 'ImportModels/Clientes.xlsx'},
  {Formulario: 'Productos y servicios', Carpeta: 'Administracion/', modeldata: '@ModeloProductosServicios', storedprocedure: '[administracion].[ImportProductServices]', modelImport: 'ImportModels/Productosyservicios.xlsx'},
  {Formulario: 'Vendedores', Carpeta: 'Administracion/', modeldata: '@ModeloVendedores', storedprocedure: '[administracion].[ImportVendedores]', modelImport: 'ImportModels/Vendedores.xlsx'},
  {Formulario: 'Ingresos reales', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaIngresosReales', storedprocedure: '[desempenofinanciero].[ImportIngresosreales]', modelImport: 'ImportModels/Ingresosreal.xlsx'},
  {Formulario: 'Ingresos proyectados', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaIngresosProyectados', storedprocedure: '[desempenofinanciero].[ImportIngresosproyectados]', modelImport: 'ImportModels/Ingresosproyectados.xlsx'},
  {Formulario: 'Egresos reales', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaEgresosReales', storedprocedure: '[desempenofinanciero].[ImportEgresosreales]', modelImport: 'ImportModels/EgresosReal.xlsx'},
  {Formulario: 'Egresos proyectados', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloEntradaEgresosProyectados', storedprocedure: '[desempenofinanciero].[ImportEgresosproyectados]', modelImport: 'ImportModels/EgresosProyectado.xlsx'},
  {Formulario: 'Cartera', Carpeta: 'DesempenoFinanciero/', modeldata: '@ModeloCartera', storedprocedure: '[cartera].[ImportCartera]', modelImport: 'ImportModels/EgresosProyectado.xlsx'},
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
  dataSource: any[] = [];

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(private sharedStateService: SharedStateService, private importService: ImportService, public dialog: MatDialog){
    this.sharedStateService.updateSuggestedQuestions([]);
  }; 

  
  
  ngOnInit(): void {

    
    this.sharedStateService.toggleSidenavVisible(true);

  
    this.dataSource = USERS_DATA;

    

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.dataSource.filter(item => 
      item.nombreCategoria.toLowerCase().includes(filterValue)
    );
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


  onExport(element: any) {

    const additionalData = element.Formulario;
    const carpeta = element.Carpeta;
    const modeldata = element.modeldata;
    const storedprocedure = element.storedprocedure;

    console.log(element); 

    this.importService.getPreSignedDownloadUrl(element.modelImport).subscribe(response => {
      const downloadUrl = response.url;
      console.log(response.url); 
      
      this.importService.downloadFileFromS3(downloadUrl).subscribe(blob => {
        // Crear un enlace para descargar el archivo
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = element.modelImport; // Nombre del archivo descargado
        a.click();
        URL.revokeObjectURL(objectUrl); // Limpiar la URL del objeto después de descargar
      });
    });
   
   
  }

  uploadFile(file: File): void {
    // Lógica para subir el archivo
    console.log('Uploading file:', file);
  }
  

}
