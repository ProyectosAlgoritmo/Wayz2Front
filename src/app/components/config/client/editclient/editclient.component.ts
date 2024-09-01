import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuxService } from '../../../../services/aux-service.service';
import { ConfigService } from '../../../../services/config.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-editclient',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './editclient.component.html',
  styleUrls: ['./editclient.component.css']
})
export class EditclientComponent {
  idcliente: number;
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditclientComponent>
  ) {
    this.idcliente = data.idclient;
    this.clientForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      descripcion: [''],
      tipoIdentificacion: ['', Validators.required],
      identificacion: ['', Validators.required],
      pais: [''],
      departamento: [''],
      ciudad: [''],
      direccionEmpresa: [''],
      codigoPostal: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      telefono: [''],
      nombreResponsable: [''],
      telefonoResponsable: [''],
      correoResponsable: ['', [Validators.required, Validators.email]],
      limiteCreditoDias: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      fechaDeCreacion: [{ value: '', disabled: true }] 
    });

    this.cargarDetalles();
  }

  cargarDetalles() {
    this.auxService.ventanaCargando();
    console.log(this.idcliente); 
    this.configService.ObtenerDetailClient(this.idcliente).subscribe({
      next: (data) => {
        this.auxService.cerrarVentanaCargando();

        if (data.success) {
          if (!data.warning) {
            this.clientForm.patchValue(data.data); // Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Clientes", data.message); 
          }
        } else {
          this.auxService.AlertWarning("Error", data.message); 
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al cargar los clientes:', error);
      },
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();

      console.log(this.idcliente)

      this.configService.actualizarCliente(this.idcliente, this.clientForm.value).subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Actualizar cliente', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al actualizar cliente', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al actualizar cliente', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          console.log(error.status); 
          this.auxService.AlertError('Error al actualizar el cliente:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }

  onInputChange(event: any, controlName: string): void {
    const input = event.target.value;
    const sanitizedInput = this.auxService.validateInteger(input);
    this.clientForm.get(controlName)?.setValue(sanitizedInput, { emitEvent: false });
  }

}