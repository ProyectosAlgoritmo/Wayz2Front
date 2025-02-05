import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class ArrangeService {

  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl + '/Arrange';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  arrange(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    console.log("Data: ", Data)
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .post(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }


}
