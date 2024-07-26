import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


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
}