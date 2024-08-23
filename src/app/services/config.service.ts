import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {

    this.apiUrl = environment.apiUrl + '/Config'; 

    
   }

   getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }


  //Clients


  ObtenerClients(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Clients`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailClient(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Detail-Clients/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  actualizarCliente(idCliente: number, clienteData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-Client/${idCliente}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, clienteData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Bussines Unit 


  ObtenerBusinessUnits(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-business-units`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailbusinessunit(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Detail-businessunit/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  actualizarbusinessunit(idUnidad: number, UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-Detallebusinessunit/${idUnidad}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  Createbusinessunit(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-Detallebusinessunit`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  // Products and services 

  ObtenerProductsServices(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-ProductServices`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailProductsServices(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Detail-ProductServices/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  actualizarProductsService(idProductsService: number, ProductData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-ProductServices/${idProductsService}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, ProductData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  //zones

  ObtenerZones(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-zones`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailZone(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Detail-zone/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerTypesZones(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-type-zones`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  actualizarzona(idUnidad: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-zone/${idUnidad}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CreateZone(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-zone`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  // Generic 

  GetData(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetail(id: number, link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
  
  UpdateData(id: number, Data: any, link: string): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}/${id}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, Data, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

}
