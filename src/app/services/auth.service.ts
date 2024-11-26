import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuxService } from './aux-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { el } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = environment.apiUrl; 
  //private apiUrl = 'http://3.135.240.110:81/api'
  private token = '';


  constructor(private httpClient: HttpClient, private router: Router, private auxService: AuxService, private jwtHelper: JwtHelperService) {
    this.token = <string>sessionStorage.getItem('token');
  }


  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable()); // {1}

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  private tokenAvailable(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(Email: string, Password: string): Observable<any> {
    //eturn this.httpClient.post<any>(this.api + '/auth' , {Email, Password})
    return this.httpClient.post<any>(`${this.apiUrl}/auth`, { Email, Password })
      .pipe(map(user => {
        // Guarda detalles de usuario y token en el local storage para mantener al usuario logueado
        this.auxService.cerrarVentanaCargando();
        if(user.data != null){
        
          sessionStorage.setItem('permisos', JSON.stringify(user.data.permisos));
          if(user.message == "Cambiar contraseña"){
            //sessionStorage.setItem('token', user.data.payload);
            this.loggedIn.next(false);     
          }else{
            sessionStorage.setItem('token', user.data.token);
            this.loggedIn.next(true);
          }
        }
        return user;
        

      }));
  }

  changePassword(link: string, password: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.httpClient
      .post(`${this.apiUrl}/${link}`, { password: password }, { headers })
      .pipe(
        map((response: any) => {
          // Validar la respuesta: suponer que la respuesta tiene un campo "status" o "message"
          if (response.message && localStorage.getItem("cambio") != null) {
            this.loggedIn.next(true);
          } 
          return response;
        }),
        catchError((error) => {
          console.error('Error al cambiar la contraseña:', error);
          return this.auxService.handleError(error); // Usar el servicio auxiliar para manejar el error
        })
      );
  }
  

  RecoveryPass(Email: string, url: string): Observable<any> {
    //eturn this.httpClient.post<any>(this.api + '/auth' , {Email, Password})
    return this.httpClient.post<any>(`${this.apiUrl}/auth/RecoveryPass`, { Email, url })
      .pipe(map(user => {
        // Guarda detalles de usuario y token en el local storage para mantener al usuario logueado
        this.auxService.cerrarVentanaCargando();
        if(user.data != null){
        }
        return user;
        

      }));
  }

  getPermisos(): any[] {
    const permisos = sessionStorage.getItem('permisos');
    return permisos ? JSON.parse(permisos) : [];
  }

  logout() {
    // Elimina al usuario del local storage y establece el currentUser a null
    sessionStorage.removeItem('token');
    this.loggedIn.next(false); 
    this.router.navigate(['/login']);
  }

  isAuthenticatedBool(): boolean {
    return this.tokenAvailable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(<string>sessionStorage.getItem('token')); // Decodificar el token JWT
  }

  getToken(): string {
    return <string>sessionStorage.getItem('token') // Obtener el token almacenado en localStorage
  }

 
}
