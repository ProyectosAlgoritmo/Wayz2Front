import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuxService {

  private loadingModal: any; // Variable para almacenar la referencia del modal

  constructor() {}
 


  ventanaCargando() {
    this.loadingModal = Swal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      imageUrl: "../../../assets/images/loading.gif",
      customClass: {
        popup: "loading",
      },
    });
  }

  cerrarVentanaCargando() {
    if (this.loadingModal) {
      Swal.close();
      this.loadingModal = null; // Resetear la referencia del modal
    }
  }

  AlertWarning(title: string, mensaje: string){
    Swal.fire({
    icon: "warning",
    title: title,
    text: mensaje,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'custom-swal'
    }
    }).then(() => {
    Swal.close();
    })
  }

  AlertError(title: string, mensaje: string){
    Swal.fire({
    icon: "error",
    title: title,
    text: mensaje,
    confirmButtonText: 'Aceptar',
    customClass: {
      popup: 'custom-swal'
    }
    }).then(() => {
    Swal.close();
    })
  }

  AlertSuccess(title: string, mensaje: string){
  Swal.fire({
    icon: "success",
    title: title,
    text: mensaje,
    showConfirmButton: false,
    timer: 3000,
    customClass: {
      popup: 'custom-swal'
    }
  });
  }

  validateInteger(value: string): string {
    // Eliminar cualquier carácter que no sea un número entero
    return value.replace(/[^0-9]/g, '');
  }

  validateDecimal(value: string): string {
    // Eliminar cualquier carácter que no sea un número o un punto decimal
    let sanitizedValue = value.replace(/[^0-9.]/g, '');
  
    // Si hay más de un punto decimal, solo se conserva el primero
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) {
      sanitizedValue = parts[0] + '.' + parts.slice(1).join('');
    }
  
    // Si hay un punto decimal, no formatear hasta que haya al menos un dígito después del punto
    if (parts.length === 2 && parts[1].length > 2) {
      sanitizedValue = parseFloat(sanitizedValue).toFixed(2);
    }
  
    return sanitizedValue;
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      // Aquí puedes manejar el error 401
      return throwError('No autorizado. Por favor, consulte con el administrador');
    } else {
      console.log('No autorizado. Por favor, inicie sesión.')
      // Otros errores pueden manejarse aquí
      return throwError('Hubo un problema con la solicitud. Intente nuevamente más tarde.');
    }
  }

  
}