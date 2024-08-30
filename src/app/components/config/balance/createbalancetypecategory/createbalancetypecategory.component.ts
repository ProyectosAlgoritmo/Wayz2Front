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
  selector: 'app-createbalancetypecategory',
  standalone: true,
  imports: [NzInputModule, NzSelectModule,  NzIconModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './createbalancetypecategory.component.html',
  styleUrl: './createbalancetypecategory.component.css'
})
export class CreatebalancetypecategoryComponent {
  clientForm: FormGroup;
  tiposzonas: any; 

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<CreatebalancetypecategoryComponent>
  ) {
    this.clientForm = this.fb.group({
      nombreCategoria: ['', Validators.required],
    });

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();


      this.configService.CrearBalanceTipoCategoria(this.clientForm.value).subscribe({
        next: (data) => {
          if (data.success) {

            if(!data.warning){
              this.auxService.AlertSuccess('Tipo de categoría balance creada', data.message);
            }
            else
            {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Error al crear tipo de categoría balance', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al crear tipo de categoría balance', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertError('Error al crear tipo de categoría balance:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }
}
