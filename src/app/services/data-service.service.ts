import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { of, map, Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { AuxService } from './aux-service.service';



@Injectable({
  providedIn: 'root',
})
export class DateService {

  private loadingModal: any; // Variable para almacenar la referencia del modal
  readonly apiUrl: string;

  constructor(private configService: ConfigService, private auxService: AuxService, private httpClient: HttpClient) {

    this.apiUrl = environment.apiUrl + '/Utilities'; 

  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }


  ObtenerClients(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Clients`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  GetData(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
 

  cargarCliente(): Observable<any[]> {
    return this.configService.ObtenerClients().pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Clientes", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar categorías:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }

  cargarVendedor(): Observable<any[]> {
    return this.GetData('Get-supervisor').pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Vendedor", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar vendedores:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }

  cargarZonas(): Observable<any[]> {
    return this.GetData('Get-zones').pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Zonas", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar zonas:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }

  cargarProductos(): Observable<any[]> {
    return this.GetData('Get-ProductServices').pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Productos", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar productos:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }


  cargarUnidades(): Observable<any[]> {
    return this.GetData('Get-business-units').pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Unidades de negocio", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar unidades de negocio:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }


  cargarTipoegresos(): Observable<any[]> {
    return this.GetData('Get-types-expense').pipe(
      map((data) => {
        if (data.success) {
          if (!data.warning) {
            return data.data; // Retorna el arreglo de clientes
          } else {
            this.auxService.AlertWarning("Unidades de negocio", data.message);
            return [];
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
          return [];
        }
      }),
      catchError((error) => {
        this.auxService.AlertError('Error al cargar unidades de negocio:', error);
        return of([]); // Retorna un arreglo vacío en caso de error
      })
    );
  }

  
}