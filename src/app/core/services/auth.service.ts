import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private api = 'http://localhost:5215/api'

  constructor(private httpClient: HttpClient, private router: Router) { }

  login(user: string, password: string): Observable<any> {
    return this.httpClient.post<any>(this.api + '/login' , {user, password})
  }
}
