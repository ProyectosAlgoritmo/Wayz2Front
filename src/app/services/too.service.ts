import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class TooService {

  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl + '/Too';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getToos(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/get-all-toos`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  get(link: string,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}`, { headers })
    .pipe(
      catchError((error) => {
        return this.auxService.handleError(error);
      })
    );
  }

  ObtenerCategorias(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/get-all-categories/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerCenterlines(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/get-all-centerlines/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CreateToo(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .post(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  deleteCLImg(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/delete-CenterlineImg/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

}