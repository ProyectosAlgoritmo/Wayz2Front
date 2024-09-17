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
  selector: 'app-createbusinessunit',
  standalone: true,
  imports: [NzInputModule, NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './createbusinessunit.component.html',
  styleUrl: './createbusinessunit.component.css'
})
export class CreatebusinessunitComponent {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<CreatebusinessunitComponent>
  ) {
    this.clientForm = this.fb.group({
      clase: ['', Validators.required],
      nombre: ['', Validators.required],
      fechaDeCreacion: [{ value: '', disabled: true }] 
    });

  }


  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();


      this.configService.Createbusinessunit(this.clientForm.value).subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Actualizar unidad de negocio', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al crear unidad de negocio', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al crear unidad de negocio', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertError('Error al crear el unidad de negocio:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }

 
}

