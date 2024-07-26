import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl; 
  //private apiUrl = 'http://3.135.240.110:81/api'
  private token = '';


  constructor(private httpClient: HttpClient, private router: Router, private auxService: AuxService) {
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
        this.auxService.cerrarVentanaCargando();
        if(user.data != null){
        
        localStorage.setItem('token', user.data.payload);
        localStorage.setItem('permisos', JSON.stringify(user.data.permisos));
        this.loggedIn.next(true);     
       
        }
        return user;
        

      }));
  }

  getPermisos(): any[] {
    const permisos = localStorage.getItem('permisos');
    return permisos ? JSON.parse(permisos) : [];
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
