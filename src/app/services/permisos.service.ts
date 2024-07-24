import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  readonly apiUrl: string;
  private token: string | null;

  constructor(private httpClient: HttpClient) { 

    this.apiUrl = 'https://localhost:7278/api/auth'; 
    this.token =  localStorage.getItem('token');
    console.log(this.token); 
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
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