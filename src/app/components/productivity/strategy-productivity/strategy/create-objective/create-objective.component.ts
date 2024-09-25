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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { th } from 'date-fns/locale';
@Component({
  selector: 'app-create-objective',
  templateUrl: './create-objective.component.html',
  styleUrls: ['./create-objective.component.css'],
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
    NzSwitchModule
  ],
})
export class CreateObjectiveComponent implements OnInit {
  strategicForm: FormGroup;
  estrategia: any;
  switchValue = false;
  etapas: any;
  titulo: string = 'Crear objetivo';
  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private permisosService: PermisosService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreatetypebalanceComponent>
  ) {
    this.strategicForm = this.fb.group({
      idObjetivos: [0, ],
      nombre: ['', Validators.required],
      idEstrategia: ['', Validators.required],
      porcentajeavanceReal: [0,Validators.required],
      porcentajeavanceProyectado: [0,Validators.required],
      idEtapa: [null, Validators.required],
      estado: [false, Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar objetivo';
      this.strategicForm.patchValue({
        idObjetivos: this.data.id || 0, 
        nombre: this.data.nombre || '', 
        idEstrategia: this.data.idEstrategia || '', 
        porcentajeavanceReal: this.data.porcentajeavance_real || 0,
        porcentajeavanceProyectado: this.data.porcentajeavance_proyectado || 0,
        idEtapa: this.data.idEtapa || null,
        estado: this.data.estado || false 
      });
    }
    this.getStrategy();
    this.getStrategy();
    this.GetStatus();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  getStrategy() {
    this.productivityService.get('get-strategy').subscribe({
      next: (data) => {
        if (data.success) {
          this.estrategia = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los registros',
          error
        );
      },
    });
  }

  GetStatus() {
    this.productivityService.get('get-status').subscribe({
      next: (data: any) => {
        if (data) {
          this.etapas = data.data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar llas unidades:', error);
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      this.updateObjective();
    } else {
      this.createObjective();
    }
  }

  updateObjective() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Update(
          'update-objective',
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
                'Error al actualizar el registro',
                data.message
              );
            }
          },
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error al actualizar el registro',
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
  createObjective() {
    if (this.strategicForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create(
          'create-objective',
          this.strategicForm.value
        )
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'registro creado correctamente',
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
              'Error al crear el registro',
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
