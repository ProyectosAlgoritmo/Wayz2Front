import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient) {

    this.apiUrl = environment.apiUrl + '/Config'; 

    
   }

   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }


  ObtenerClients(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Clients`, { headers });
  }

  

  ObtenerDetailClient(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Detail-Clients/${id}`, { headers });
  }


}
