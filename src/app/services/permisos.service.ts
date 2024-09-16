import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  readonly apiUrl: string;

  constructor(private httpClient: HttpClient) { 

    this.apiUrl = environment.apiUrl + '/auth'; 
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  ObtenerEmpresas(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-User-Empresas`, { headers });
  }

  getLoginEmpresas(idEmpresa: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-token-Empresa/${idEmpresa}`, { headers });
  }
}