import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuxService } from './aux-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProductivityService {
  readonly apiUrl: string;

  constructor(private httpClient: HttpClient, private auxService: AuxService) {
    this.apiUrl = environment.apiUrl + '/Productivity';
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });
  }

  getStrategy(link: string,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}`, { headers })
    .pipe(
      catchError((error) => {
        console.log(link); 
        return this.auxService.handleError(error);
      })
    );
  }

  UpdateStrategy(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  UpdateeStrategySubTable(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  ObtenerDateStrategy(link: string): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
      .get(`${this.apiUrl}/${link}`, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  DeleteStrategy(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }
  DeleteStrategyTipo(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  getStrategicPillar(link: string,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient
    .get(`${this.apiUrl}/${link}`, { headers })
    .pipe(
      catchError((error) => {
        console.log(link); 
        return this.auxService.handleError(error);
      })
    );
  }

  CreateStrategicPillar(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .post(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  UpdateeStrategicPillar(link: string, Data: any): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/${link}`; // Endpoint para actualizar un cliente
    return this.httpClient
      .put(url, Data, { headers })
      .pipe(catchError(this.auxService.handleError.bind(this)));
  }

  DeleteStrategicPillar(link: string, id: number,): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.delete(`${this.apiUrl}/${link}/${id}`, { headers }).pipe( catchError(this.auxService.handleError.bind(this)));
  }


  getDataStructure1(): Observable<any[]> {
    
    const data = [
      {
        "idEstrategia": 1,
        "nombre": "Proyecto Alpha",
        "estrategia": "Crecimiento de Mercado",
        "descripcion": "Expansión a nuevos mercados internacionales"
      },
      {
        "idEstrategia": 2,
        "nombre": "Proyecto Beta",
        "estrategia": "Diferenciación de Producto",
        "descripcion": "Desarrollo de características únicas para nuevos productos"
      },
      {
        "idEstrategia": 3,
        "nombre": "Proyecto Gamma",
        "estrategia": "Liderazgo en Costos",
        "descripcion": "Reducción de costos operativos para aumentar la competitividad"
      },
      {
        "idEstrategia": 4,
        "nombre": "Proyecto Delta",
        "estrategia": "Innovación Disruptiva",
        "descripcion": "Implementación de tecnologías emergentes en el modelo de negocio"
      },
      {
        "idEstrategia": 5,
        "nombre": "Proyecto Epsilon",
        "estrategia": "Alianzas Estratégicas",
        "descripcion": "Colaboración con empresas clave en la industria para compartir recursos"
      }
    ];
    return of(data);
  }
}
