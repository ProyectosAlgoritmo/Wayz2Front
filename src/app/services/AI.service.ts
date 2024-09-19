import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuxService } from './aux-service.service';
import { environment } from '../../environments/environment';
import { catchError, Observable, of } from 'rxjs';


@Injectable({
    providedIn: 'root',
  })
  export class AIService {
    readonly apiUrl: string;
  
    constructor(private httpClient: HttpClient, private auxService: AuxService) {
      this.apiUrl = environment.apiUrl;
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

    GetDatapost(link: string, Data: any): Observable<any> {
      const headers = this.getHeaders();
      return this.httpClient.post(`${this.apiUrl}/${link}`, Data, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
     }

  }