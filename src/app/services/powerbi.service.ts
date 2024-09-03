import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class powerbiService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl + '/PowerBI'; 

    
   }

   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
   }

   getToken(request: any): Observable<any> {   
    const headers = this.getHeaders();
    return this.httpClient.post<any>(`${this.apiUrl}/embedToken`, request, {headers});
   }


}