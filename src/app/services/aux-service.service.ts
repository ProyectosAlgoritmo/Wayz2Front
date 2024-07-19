import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class AuxService {

  constructor() {}



  ventanaCargando() {
    Swal.fire({
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      imageUrl: "../../../assets/images/loading.gif",
      customClass: {
        popup: "loading",
      },
    });
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
}