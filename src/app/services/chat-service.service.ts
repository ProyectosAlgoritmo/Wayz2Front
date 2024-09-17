import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getChatResponse(chatHistoryRequest: any): Observable<any> {   
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/getResponse`, chatHistoryRequest, {headers});
  }
}
