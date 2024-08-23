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
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-editproductsservices',
  standalone: true,
  imports: [NzInputModule, NzSelectModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './editproductsservices.component.html',
  styleUrl: './editproductsservices.component.css'
})
export class EditproductsservicesComponent {
  idProductoServicio: number;
  clientForm: FormGroup;
  unidades: any; 

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditproductsservicesComponent>
  ) {
    this.idProductoServicio = data.idProductoServicio;
    this.clientForm = this.fb.group({
      nombre: ['', Validators.required],
      codigoReferencia: ['', Validators.required],
      idUnidad: ['', Validators.required], 
      valorVenta: ['', Validators.required],
      costoProduccion: ['', Validators.required],
      fechaDeCreacion: [{ value: '', disabled: true }] 
    });
   
    this.cargarDetalles(); 
    this.cargarUnidades(); 
    
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  cargarDetalles() {
    this.auxService.ventanaCargando();
    this.configService.ObtenerDetailProductsServices(this.idProductoServicio).subscribe({
      next: (data) => {
        this.auxService.cerrarVentanaCargando();

        if (data.success) {
          if (!data.warning) {
            this.clientForm.patchValue(data.data); // Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Productos y servicios", data.message); 
          }
        } else {
          this.auxService.AlertWarning("Error", data.message); 
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al cargar los productos y servicios:', error);
      },
    });
  }


  cargarUnidades() {
    this.configService.ObtenerBusinessUnits().subscribe({
      next: (data) => {
        if (data.success) {

          if (!data.warning) {
            console.log(data.data)
            this.unidades = data.data;// Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Unidades", data.message); 
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar categorías:', error);
      }
    });
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();

      // Convertir fecha de creación a formato "yyyy-MM-dd"
     
      this.configService.actualizarProductsService(this.idProductoServicio, this.clientForm.value).subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Actualizar unidad de negocio', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al actualizar unidad de negocio', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al actualizar unidad de negocio', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertError('Error al actualizar el unidad de negocio:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }


  onInputChange(event: any, controlName: string): void {
    const input = event.target.value;
    const sanitizedInput = this.auxService.validateDecimal(input);
    this.clientForm.get(controlName)?.setValue(sanitizedInput, { emitEvent: false });
  }

}
