import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:7278/api'
  private token = '';


  constructor(private httpClient: HttpClient, private router: Router) {
    this.token = <string>localStorage.getItem('token');
  }


  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable()); // {1}

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  private tokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }

  login(Email: string, Password: string): Observable<any> {
    //eturn this.httpClient.post<any>(this.api + '/auth' , {Email, Password})

    return this.httpClient.post<any>(`${this.apiUrl}/auth`, { Email, Password })
      .pipe(map(user => {
        // Guarda detalles de usuario y token en el local storage para mantener al usuario logueado
        if(user.data != null){
        localStorage.setItem('token', JSON.stringify(user.payload));
        this.loggedIn.next(true);     
        }
        return user;
        

      }));
  }

  logout() {
    // Elimina al usuario del local storage y establece el currentUser a null
    localStorage.removeItem('token');
    this.loggedIn.next(false); 
    this.router.navigate(['/login']);
  }

  isAuthenticatedBool(): boolean {
    return this.tokenAvailable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

 
}
