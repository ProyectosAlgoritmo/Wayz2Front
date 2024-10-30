import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuxService } from './aux-service.service';
import { environment } from '../../environments/environment';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {
    this.apiUrl = environment.apiUrl + '/balance';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getBalance(link: string, year: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}/${year}`, { headers })
    .pipe(
      catchError((error) => {
        console.log(link); 
        return this.auxService.handleError(error);
      })
    );
  }

  UpdateBalance(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  UpdateeBalanceSubTable(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDateBalance(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
      .get(`${this.apiUrl}/${link}`, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  DeleteBalance(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
  DeleteBalanceTipo(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  getDataStructure1(): Observable<any[]> {
    
    const data = [
      {
        "id": 1,
        "empresa": "Empresa ABC",
        "Nombre": "Estrategia A",
        "Descripcion": "Descripción de la estrategia A",
        "subData": [
          {
            "id": 1,
            "estrategia": 1,
            "Nombre": "Objetivo A1",
            "Etapa": "Inicial",
            "Porcentajeavance_real": 50,
            "Porcentajeavance_proyectado": 80,
            "Estado": true
          },
          {
            "id": 2,
            "estrategia": 1,
            "Nombre": "Objetivo A2",
            "Etapa": "Intermedia",
            "Porcentajeavance_real": 30,
            "Porcentajeavance_proyectado": 70,
            "Estado": true
          }
        ]
      },
      {
        "id": 2,
        "empresa": "Empresa XYZ",
        "Nombre": "Estrategia B",
        "Descripcion": "Descripción de la estrategia B",
        "subData": [
          {
            "id": 3,
            "estrategia": 2,
            "Nombre": "Objetivo B1",
            "Etapa": "Inicial",
            "Porcentajeavance_real": 60,
            "Porcentajeavance_proyectado": 90,
            "Estado": false
          }
        ]
      }
    ]    
    return of(data);
  }
}
