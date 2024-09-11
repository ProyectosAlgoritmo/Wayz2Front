import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class financialperformanceService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl + '/financialperformance'; 

    
   }

   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

   GetData(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
   }

   ObtenerDetail(id: number, link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  UpdateData(id: number, Data: any, link: string): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}/${id}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, Data, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  getCashFlow(link: string, year: number,): Observable<any> {

    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}/${year}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  UpdateCashFlow(link: string, Data: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, Data, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  UpdateeCashFlowSubTable(link: string, Data: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, Data, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDateCashFlow(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  getDataStructure1(): Observable<any[]> {
    
    const data = [
      {
          "id": 1,
          "Descripcion": "SALDO FINAL",
          "Enero": {'proyectado': 'proyectado','real': 'real'},
          "Febrero": {'proyectado': null,'real': null},
          "Marzo": {'proyectado': null,'real': null},
          "Abril": {'proyectado': null,'real': null},
          "Mayo": {'proyectado': null,'real': null},
          "Junio": {'proyectado': '5282','real': 'real'},
          "Julio": {'proyectado': '22362','real': 'real'},
          "Agosto": {'proyectado': '2252','real': 'real'},
          "Septiembre": {'proyectado': '25468','real': 'real'},
          "Octubre": {'proyectado': null,'real': null},
          "Noviembre": {'proyectado': null,'real': null},
          "Diciembre": {'proyectado': null,'real': null},
          "subData": [
              {
                  "id": 1,
                  "Descripcion": "SALDO FINAL",
                  "Enero": {'proyectado': 'proyectado','real': 'real'},
                  "Febrero": {'proyectado': null,'real': null},
                  "Marzo": {'proyectado': null,'real': null},
                  "Abril": {'proyectado': null,'real': null},
                  "Mayo": {'proyectado': null,'real': null},
                  "Junio": {'proyectado': '5282','real': 'real'},
                  "Julio": {'proyectado': '22362','real': 'real'},
                  "Agosto": {'proyectado': '2252','real': 'real'},
                  "Septiembre": {'proyectado': '25468','real': 'real'},
                  "Octubre": {'proyectado': null,'real': null},
                  "Noviembre": {'proyectado': null,'real': null},
                  "Diciembre": {'proyectado': null,'real': null},
              }
          ]
      }
  ];
    return of(data);
  }

}