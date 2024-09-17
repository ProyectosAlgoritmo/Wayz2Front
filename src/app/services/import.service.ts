import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import { AuxService } from './aux-service.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl; 
   }

   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  /*getUrlBucket(file: File, carpeta: string) {
    const headers = this.getHeaders();
    const fileName = carpeta + file.name; 
    const payload = { ObjectName: fileName };
    //return this.httpClient.get(`${this.apiUrl}/Get-token-Amazon/`, { headers });
    
    this.httpClient.post<{ url: string }>(`${this.apiUrl}/Utilities/Get-token-Amazon/`, payload , { headers }).subscribe(response => {
      const url = response.url;
      const formData = new FormData();
      formData.append('file', file);

      this.httpClient.put(url, file, { headers: { 'Content-Type': file.type !== '' ? file.type : 'application/octet-stream' }, responseType: 'text' })  // Cambiar responseType a 'text' para capturar el XML
            .subscribe(() => {
                console.log('File uploaded successfully');
            }, error => {
                console.error('Error uploading file', error);
                console.log(error.error); // Mostrar el contenido del error
            });
    });
  }*/

    getUrlBucket(file: File, carpeta: string): Observable<{ url: string }> {
      const headers = this.getHeaders();
      //const fileName = carpeta + file.name; 
      const payload = { ObjectName: carpeta };
  
      return this.httpClient.post<{ url: string }>(`${this.apiUrl}/Utilities/Get-token-Amazon/`, payload, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
    }
  
    uploadFileToS3(url: string, file: File): Observable<any> {
      const headers = { 'Content-Type': file.type !== '' ? file.type : 'application/octet-stream' };
      return this.httpClient.put(url, file, { headers, responseType: 'text' });
    }



  // Método para obtener la URL prefirmada desde el backend
  getPreSignedDownloadUrl(file: File): Observable<{ url: string }> {
    const headers = this.getHeaders();
      //const fileName = carpeta + file.name; 
    const payload = { ObjectName: file };
    return this.httpClient.post<{ url: string }>(`${this.apiUrl}/Utilities/Get-urlDownload-Amazon/`, payload, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Método para descargar el archivo desde S3 usando la URL prefirmada
  downloadFileFromS3(url: string): Observable<Blob> {
    return this.httpClient.get(url, { responseType: 'blob' });
  }



  ImportDesempenofinanciero(payload: any) : Observable<any> {
    const headers = this.getHeaders();
    //const payload = { fileUrl, bucketName, objectName };
    return this.httpClient.post(`${this.apiUrl}/imports/Import-desempeno-financiero/`, payload , { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  public convertXlsxToCsv(file: File, delimiter: string = '\t'): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          // Usar cellDates: true para manejar las fechas automáticamente
          const data: (string | Date)[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false }) as (string | Date)[][];

          // Convertir fechas a formato 'YYYY-MM-DD' si son Date objects
          const formattedData = this.formatDates(data);
          const csvData = this.convertToCsv(formattedData, delimiter);

          // Crear un archivo CSV a partir de los datos
          const blob = new Blob([csvData], { type: 'text/csv' });
          const csvFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".csv"), { type: 'text/csv' });

          resolve(csvFile);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsBinaryString(file);
    });
  }

  private formatDates(data: (string | Date)[][]): string[][] {
    return data.map(row => {
      return row.map(cell => {
        if (cell instanceof Date) {
          return cell.toISOString().split('T')[0];
        }
        return cell;
      }) as string[];
    });
  }

  private convertToCsv(data: any[], delimiter: string): string {
    return data.map(row => row.join(delimiter)).join('\n');
  }
  
}
