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

  // Balance
  // Balance - tipo categoria

  ObtenerBalanceTipoCategoria(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Balance-categories-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailBalanceTipoCategoria(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-Balance-categories-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarBalanceTipoCategoria(idUnidad: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-Balance-categories-type/${idUnidad}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearBalanceTipoCategoria(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-Balance-categories-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Balance tipo

  ObtenerBalanceTipo(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-Balance-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailBalanceTipo(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-Balance-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarBalanceTipo(idBalancetipo: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-Balance-type/${idBalancetipo}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearBalanceTipo(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-Balance-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Estado de resultados
  // Estado de resultados categorias

  ObtenerERTipoCategoria(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-ER-categories-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailERTipoCategoria(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-ER-categories-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarERTipoCategoria(idUnidad: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-ER-categories-type/${idUnidad}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearERTipoCategoria(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-ER-categories-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Estado de resultados tipo

  ObtenerERTipo(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-ER-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailERTipo(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-ER-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarERTipo(idERtipo: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-ER-type/${idERtipo}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearERTipo(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-ER-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Flujo de caja
  // Flujo de caja categorias

  ObtenerFCTipoCategoria(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-FC-categories-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailFCTipoCategoria(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-FC-categories-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarFCTipoCategoria(idUnidad: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-FC-categories-type/${idUnidad}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearFCTipoCategoria(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-FC-categories-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  // Flujo caja tipo

  ObtenerFCTipo(): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.get(`${this.apiUrl}/Get-FC-type`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDetailFCTipo(idTipoCategoria: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Get-Detail-FC-type/${idTipoCategoria}`;
    return this.httpClient.get(url, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  ActualizarFCTipo(idERtipo: number, UnitData: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Update-FC-type/${idERtipo}`; // Endpoint para actualizar un cliente
    return this.httpClient.put(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }

  CrearFCTipo(UnitData: any): Observable<any> {

    const headers = this.getHeaders();
    const url = `${this.apiUrl}/Create-FC-type`; // Endpoint para actualizar un cliente
    return this.httpClient.post(url, UnitData, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
}
