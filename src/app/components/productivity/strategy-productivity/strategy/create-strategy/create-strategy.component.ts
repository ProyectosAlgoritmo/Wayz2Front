import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuxService } from '../../../../../services/aux-service.service';
import { ReactiveFormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../../../shared/shared.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CreatetypebalanceComponent } from '../../../../config/balanceconfig/typebalance/createtypebalance/createtypebalance.component';
import { ProductivityService } from '../../../../../services/productivity.service';
import { PermisosService } from '../../../../../services/permisos.service';

@Component({
  selector: 'app-create-strategy',
  templateUrl: './create-strategy.component.html',
  styleUrls: ['./create-strategy.component.css'],
  standalone: true,
  imports: [
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
    NzFormModule,
  ],
})
export class CreateStrategyComponent implements OnInit {
  strategicForm: FormGroup;
  empresas: any;

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private permisosService: PermisosService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreatetypebalanceComponent>
  ) {
    this.strategicForm = this.fb.group({
      id: [0, ],
      nombre: ['', Validators.required],
      idEmpresa: ['', Validators.required],
      empresa: [''],
      descripcion: ['',],
    });
    if (this.data) {
      this.strategicForm.patchValue({
        id: this.data.id || 0, 
        nombre: this.data.nombre || '', 
        empresa: this.data.empresa || '', 
        descripcion: this.data.descripcion || '',
        idEmpresa: this.data.idEmpresa || '',   
      });
    }
    this.getStrategy();
    this.getStrategy();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  getStrategy() {
    this.permisosService.ObtenerEmpresas().subscribe({
      next: (data) => {
        if (data.success) {
          this.empresas = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los tipos de balance:',
          error
        );
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      this.updateCambios();
    } else {
      this.createCambios();
    }
  }

  updateCambios() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Update(
          'update-strategy',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                data.message
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al crear el registro',
                data.message
              );
            }
          },
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al cargar los tipos de balance:',
              error
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }
  createCambios() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create(
          'create-strategy',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                data.message
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al crear el registro',
                data.message
              );
            }
          },
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al cargar los tipos de balance:',
              error
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Formulario inválido',
        'Por favor, revisa los campos y corrige los errores.'
      );
    }
  }
}
