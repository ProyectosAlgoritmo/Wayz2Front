import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportService } from '../../../services/import.service';
import { switchMap } from 'rxjs/operators';
import { SharedModule } from '../../shared/shared.module';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuxService } from '../../../services/aux-service.service';
import { NotificationService } from '../../../services/notification.service';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-file-upload-import',
  standalone: true,
  imports: [MatDialogModule, SharedModule, NzUploadModule, NzButtonModule, NzIconModule, NzFormModule],
  templateUrl: './file-upload-import.component.html',
  styleUrls: ['./file-upload-import.component.css']
})
export class FileUploadImportComponent {
  fileList1: NzUploadFile[] = [];

  selectedFile: File | null = null;
  additionalData: string;
  carpeta: string;
  modeldata: string;
  storedprocedure: string;

  constructor(
    public dialogRef: MatDialogRef<FileUploadImportComponent>,
    private auxService: AuxService, private importService: ImportService, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private notificationService: NotificationService
  ) {
    this.additionalData = data.additionalData;
    this.carpeta = data.carpeta;
    this.modeldata = data.modeldata;
    this.storedprocedure = data.storedprocedure;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    
  }

  handleChange(info: { file: NzUploadFile, fileList: NzUploadFile[] }): void {
    const { fileList } = info;
    this.fileList1 = fileList.length > 1 ? [fileList[fileList.length - 1]] : fileList;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpload(): void {
    if (this.fileList1.length > 0) {

      this.auxService.ventanaCargando();

      const selectedFile = this.fileList1[0].originFileObj as File;

      const empresaNombre = sessionStorage.getItem('NombreEmpresaactual') || 'EmpresaDesconocida';
      const fechaHoraActual = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const nuevoNombreArchivo = `${fechaHoraActual}_${empresaNombre}_${this.additionalData}.csv`.replace(/\s+/g, '_');

      const renamedFile = new File([selectedFile], nuevoNombreArchivo, { type: selectedFile.type });
      

      const idEmpresa = sessionStorage.getItem('id_empresa')?.toString() || '';
      this.notificationService.updateNotificationState(idEmpresa, 'Importando')
      .then(() => {
      })
      .catch(error => {
        this.auxService.AlertError('Error al actualizar el estado de la empresa:', error);
      });


      /*this.importService.convertXlsxToCsv(renamedFile).then(csvFile => {
          this.importService.getUrlBucket(csvFile, this.carpeta);
        }).catch(error => {
          console.error('Error converting file:', error);
        }); */

        const fileName = this.carpeta + renamedFile.name; 

        this.importService.convertXlsxToCsv(renamedFile).then(csvFile => {
          this.importService.getUrlBucket(csvFile, fileName).pipe(
            switchMap(response => this.importService.uploadFileToS3(response.url, csvFile))
          ).subscribe(() => {
            
            console.log('File uploaded successfully');

            const payload = {FileUrl: fileName,  modeldata: this.modeldata, storedprocedure: this.storedprocedure };

            this.importService.ImportDesempenofinanciero(payload)
              .subscribe(response => {

                this.auxService.cerrarVentanaCargando();

                this.auxService.AlertSuccess("Importar archivo", response.message); 
                this.dialogRef.close();
              }, error => {

                this.auxService.cerrarVentanaCargando();

                this.auxService.AlertError("Importar archivo",'Error al enviar la solicitud de importación:' + error); 
              });


          }, error => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError("Importar archivo","Error al cargar el archivo: " + error); 
            
          });
        }).catch(error => {

          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertError("Importar archivo","Error al convertir el archivo:" + error); 
          
        });

        
      }
    
  
    
  }

}
