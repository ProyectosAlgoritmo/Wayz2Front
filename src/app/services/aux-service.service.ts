import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, map, Observable, BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuxService {
  private loadingModal: any; // Variable para almacenar la referencia del modal
  private searchSubject = new BehaviorSubject<string>('');
  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
  constructor() {}

  // Método para actualizar la búsqueda
  updateSearch(value: string) {
    this.searchSubject.next(value);
  }

  // Método para obtener el observable de la búsqueda
  getSearchObservable() {
    return this.searchSubject.asObservable();
  }

  ventanaCargando() {
    this.loadingModal = Swal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      imageUrl: '../../../assets/images/loading.gif',
      customClass: {
        popup: 'loading',
      },
    });
  }

  cerrarVentanaCargando() {
    if (this.loadingModal) {
      Swal.close();
      this.loadingModal = null; // Resetear la referencia del modal
    }
  }

  AlertWarning(title: string, mensaje: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: mensaje,
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'custom-swal',
      },
    }).then(() => {
      Swal.close();
    });
  }

  AlertError(title: string, mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: mensaje,
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'custom-swal',
      },
    }).then(() => {
      Swal.close();
    });
  }

  // AlertSuccess(title: string, mensaje: string) {
  //   Swal.fire({
  //     icon: 'success',
  //     title: title,
  //     text: mensaje,
  //     showConfirmButton: false,
  //     timer: 3000,
  //     customClass: {
  //       popup: 'custom-swal',
  //     },
  //   });
  // }

  AlertSuccess(title: string, mensaje: string): Promise<void> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: mensaje,
      showConfirmButton: true,  // Mostrar botón de confirmación (OK)
      customClass: {
        popup: 'custom-swal',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        return;
      }
    });
  }

  async AlertConfirmation(
    title: string,
    text: string = "You will not be able to undo this action once you confirm!",
    confirmButtonText: string = 'Confirmar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'Cancel', // Corrige el texto de "Cnacelar"
    });
  
    return result.isConfirmed; 
  }

  showToast(icon: 'success' | 'error' | 'warning' | 'info', message: string) {
    this.toast.fire({
      icon: icon,
      title: message,
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
    if (error.status === 404) {
      // Aquí puedes manejar el error 401
      return throwError(
        'There was an issue with the request. Please try again later.'
      );
    }
    if (error.status === 401) {
      // Aquí puedes manejar el error 401
      return throwError(
        'Not authorized. Please consult with the administrator.'
      );
    } else {
      // Otros errores pueden manejarse aquí
      return throwError(
        'There was an issue with the request. Please try again later.'
      );
    }
  }
}
