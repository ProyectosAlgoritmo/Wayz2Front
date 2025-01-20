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
  selector: 'app-edit-supervisor',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './edit-supervisor.component.html',
  styleUrl: './edit-supervisor.component.css'
})
export class EditSupervisorComponent {
  idVendedor: number;
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<EditSupervisorComponent>
  ) {
    this.idVendedor = data.idVendedor;
    this.clientForm = this.fb.group({
      nombreVendedor: ['', Validators.required],
      apellidoVendedor: ['', Validators.required],
      tipoIdentificacion: ['', Validators.required],
      numeroIdentificacion: ['', Validators.required],
      telefono: [''],
      correo: ['', [Validators.required, Validators.email]],
      fechaDeCreacion: [{ value: '', disabled: true }] 
    });


    this.cargarDetalles();
  }

  cargarDetalles() {
    this.auxService.ventanaCargando(); 
    this.configService.ObtenerDetail(this.idVendedor, 'Get-Detail-supervisor').subscribe({
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
        this.auxService.AlertError('Error listing the data:', error);
      },
    });
  }


  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();


      this.configService.UpdateData(this.idVendedor, this.clientForm.value, 'Update-supervisor').subscribe({
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