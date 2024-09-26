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
  formularioForm: FormGroup;
  estrategia: any;
  switchValue = false;
  isReadonly = true;
  estapaDisabled = true;
  etapas: any;
  titulo: string = 'Crear objetivo';
  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private permisosService: PermisosService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateObjectiveComponent>
  ) {
    this.formularioForm = this.fb.group({
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
      this.formularioForm.patchValue({
        idObjetivos: this.data.id || 0, 
        nombre: this.data.nombre || '', 
        idEstrategia: this.data.idEstrategia || '', 
        porcentajeavanceReal: this.data.porcentajeavance_real || 0,
        porcentajeavanceProyectado: this.data.porcentajeavance_proyectado || 0,
        idEtapa: this.data.idEtapa || null,
        estado: this.data.estado || false 
      });
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel(); 
    });
    this.getStrategy();
    this.GetStage();
  }
  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.estado = this.data.estado ? 'activo' : 'inactivo';
    }
  }

  onInpuPorcentajeReal(event: any) {
    const porcentajeavanceReal = event.target.value;
    if (porcentajeavanceReal == 100) {
      let etapa = this.etapas.find(
        (x: any) => x.nombre.toString().toLowerCase() == 'completado'
      );
      this.formularioForm.patchValue({
        idEtapa: etapa.idEtapa,
      });
      this.estapaDisabled = false;
    } else {
      this.formularioForm.patchValue({
        idEtapa: null,
      });
      this.estapaDisabled = true;
    }
    this.isReadonly = true;
  }

  async onEtapaChange(event: any) {
    if (this.etapas) {
      let etapa = this.etapas.find((x: any) => x.idEtapa == event);
      if (etapa && etapa.nombre.toString().toLowerCase() === 'completado') {
        this.formularioForm.patchValue({
          porcentajeavanceReal: 100,
        });
        this.isReadonly = false;
      } else {
        if (this.formularioForm.value.porcentajeavanceReal == 100) {
          this.formularioForm.patchValue({
            porcentajeavanceReal: null,
          });
        }
        this.isReadonly = true;
      }
    }
  }

  getStrategy() {
    this.productivityService.get('get-strategy').subscribe({
      next: (data) => {
        if (data.success) {
          this.estrategia = data.data; 
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

  GetStage() {
    this.productivityService.get('get-stage').subscribe({
      next: (data: any) => {
        if (data) {
          this.etapas = data.data;
          this.onEtapaChange(this.data.idEtapa);
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
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Update(
          'update-objective',
          this.formularioForm.value
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
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create(
          'create-objective',
          this.formularioForm.value
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
