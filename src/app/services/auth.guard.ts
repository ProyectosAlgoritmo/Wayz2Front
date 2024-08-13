import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SharedStateService } from './shared-state.service';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private sharedStateService: SharedStateService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      take(1),
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn){
          this.router.navigate(['/login']);  // {4}
          return false;
        }

        const token = this.authService.getToken();

        const payload = this.authService.decodeToken(token);
        const idEmpresa = payload['id_empresa'];
        sessionStorage.setItem('NombreEmpresaactual', payload['Nombre_empresa']);
        //localStorage.setItem('id_empresa', idEmpresa);
        this.sharedStateService.updateNotificationState(idEmpresa);
        const requireIdEmpresa = route.data['requireIdEmpresa'];
        
        if (requireIdEmpresa && !idEmpresa) {
          //this.router.navigate(['/restricted'])
          this.router.navigate(['/']);
          return false;
        }
        
       
        return true;
      })
    );
  }
}