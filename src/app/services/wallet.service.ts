import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuxService } from './aux-service.service';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {
    this.apiUrl = environment.apiUrl + '/Wallet';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  get(link: string,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}`, { headers })
    .pipe(
      catchError((error) => {
        console.log(link); 
        return this.auxService.handleError(error);
      })
    );
  }

  Update(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  Create(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .post(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }


  Delete(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
}