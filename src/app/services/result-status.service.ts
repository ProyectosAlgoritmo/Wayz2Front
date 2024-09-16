import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuxService } from './aux-service.service';
import { environment } from '../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ResultStatusService {

  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {
    this.apiUrl = environment.apiUrl + '/ResultStatus';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getResultStatus(link: string, year: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}/${year}`, { headers })
    .pipe(
      catchError((error) => {
        // this.auxService.cerrarVentanaCargando();
        // this.auxService.AlertError('Error', 'No se pudo obtener la información');
        // this.auxService.handleError(error);
        return this.auxService.handleError(error);
      })
    );
  }

  UpdateResultStatus(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  UpdateeResultStatusSubTable(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDateResultStatus(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
      .get(`${this.apiUrl}/${link}`, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  DeleteResultStatus(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
  DeleteResultStatusTipo(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  getDataStructure1(): Observable<any[]> {
    
    const data = [
      {
        id: 1,
        dato1: 'John Brown',
        dato2: 32,
        dato3: 'New York No. 1 Lake Park',
        description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        subData: [
          { nombre: 'John Brown', apellido: 32, edad: 'New York No. 1 Lake Park', familia: 'YES. ' },
          { nombre: 'Jim Green', apellido: 42, edad: 'London No. 1 Lake Park', familia: 'YES. ' }
        ]
      },
      {
        id: 2,
        dato1: 'Jim Green',
        dato2: 42,
        dato3: 'London No. 1 Lake Park',
        description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        subData: [
          { nombre: 'Joe Black', apellido: 32, edad: 'Sidney No. 1 Lake Park', familia: 'YES. ' }
        ]
      }
    ];
    return of(data);
  }

}
