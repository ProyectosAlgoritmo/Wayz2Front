import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuxService } from '../../../../../services/aux-service.service';
import { ConfigService } from '../../../../../services/config.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-edit-categories',
  standalone: true,
  imports: [NzInputModule, NzIconModule, NzSelectModule, CommonModule, ReactiveFormsModule, MatDialogModule, SharedModule, NzFormModule],
  templateUrl: './edit-categories.component.html',
  styleUrl: './edit-categories.component.css'
})
export class EditCategoriesComponent {
  clientForm: FormGroup;
  categorias: any;

  idFC: number;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditCategoriesComponent>
  ) {
    this.idFC = data.idcategory;
    this.clientForm = this.fb.group({
      nombreTipo: ['', Validators.required],
      idFccategoria: ['', Validators.required],
      nombreCategoria: [''],
      fechaRegistro: [{ value: '', disabled: true }]
    });

    this.cargarDetalles();
    this.cargarCategoriasBalance();
  }

  onCancel(): void {
    this.dialogRef.close();
  }



  cargarDetalles() {
    this.auxService.ventanaCargando();
    this.configService.ObtenerDetailFCTipo(this.idFC).subscribe({
      next: (data) => {
        this.auxService.cerrarVentanaCargando();

        if (data.success) {
          if (!data.warning) {
            console.log(data.data)
            this.clientForm.patchValue(data.data); // Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Tipo de flujo de caja", data.message);
          }
        } else {
          this.auxService.AlertWarning("Error", data.message);
        }
      },
      error: (error) => {
        this.auxService.cerrarVentanaCargando();
        this.auxService.AlertError('Error al cargar los tipos de flujo de caja:', error);
      },
    });
  }

  cargarCategoriasBalance() {
    this.configService.ObtenerFCTipoCategoria().subscribe({
      next: (data) => {
        if (data.success) {

          if (!data.warning) {
            console.log(data.data)
            this.categorias = data.data;// Vincula los datos al formulario
          } else {
            this.auxService.AlertWarning("Flujo de caja", data.message);
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los tipos de flujo de caja:', error);
      }
    });
  }

  guardarCambios() {
    if (this.clientForm.valid) {
      this.auxService.ventanaCargando();


      this.configService.ActualizarFCTipo(this.idFC, this.clientForm.value).subscribe({
        next: (data) => {
          if (data.success) {

            if (!data.warning) {
              this.auxService.AlertSuccess('Actualizar tipo de flujo de caja', data.message);
            }
            else {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertError('Error al cargar los tipos de flujo de caja:', data.message);
            }
            this.dialogRef.close(true); // Cierra el diálogo y devuelve un resultado positivo
          } else {
            this.auxService.AlertWarning('Error al actualizar tipo de flujo de caja', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertError('Error al cargar los tipos de flujo de caja:', error);
        }
      });
    } else {
      this.auxService.AlertWarning('Formulario inválido', 'Por favor, revisa los campos y corrige los errores.');
    }
  }
}
