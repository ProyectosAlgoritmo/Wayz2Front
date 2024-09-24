import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SharedModule } from '../../../shared/shared.module';
import { ProductivityService } from '../../../../services/productivity.service';
import { PermisosService } from '../../../../services/permisos.service';
import { AuxService } from '../../../../services/aux-service.service';
import { getISOWeek, parseISO } from 'date-fns';

import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DateService } from '../../../../services/data-service.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css'],
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
    NzDatePickerModule,
    NzSwitchModule,
  ],
})
export class CreateProjectComponent implements OnInit {
  formularioForm: FormGroup;
  lideres: any;
  zona: any;
  unidades: any;
  date = null;
  titulo = 'Crear proyecto';

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private permisosService: PermisosService,
    private auxService: AuxService,
    private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateProjectComponent>
  ) {
    this.formularioForm = this.fb.group({
      idProyecto: [0, Validators.required],
      nombre: ['', Validators.required],
      tipoProyecto: [''],
      liderProyecto: ['', Validators.required],
      estado: [false, Validators.required],
      idZona: ['', Validators.required],
      idUnidad: ['', Validators.required],
      porcentajeavanceProyectado: [null, Validators.required],
      porcentajeavanceReal: [null, Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar proyecto';
      this.formularioForm.patchValue({
        idProyecto: this.data.id || 0,
        nombre: this.data.nombre || '',
        tipoProyecto: this.data.tipoProyecto || '',
        liderProyecto: this.data.idLiderProyecto || 0,
        estado: this.data.estado || false,
        idZona: this.data.idZona || 0,
        idUnidad: this.data.idUnidad || 0,
        porcentajeavanceProyectado: this.data.porcentajeavanceProyectado || 0,
        porcentajeavanceReal: this.data.porcentajeavanceReal || 0,
        fechaInicio: parseISO(this.data.fechaInicio) || '',
        fechaFinal: parseISO(this.data.fechaFinal) || '',
      });
    }
    this.getLideres();
    this.getZona();
    this.getUnidades();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getLideres() {
    this.dateService.cargarVendedor().subscribe({
      next: (data: any) => {
        if (data) {
          this.lideres = data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los lideres:', error);
      },
    });
  }
  getZona() {
    this.dateService.cargarZonas().subscribe({
      next: (data: any) => {
        if (data) {
          this.zona = data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar las zonas:', error);
      },
    });
  }

  getUnidades() {
    this.dateService.cargarUnidades().subscribe({
      next: (data: any) => {
        if (data) {
          this.unidades = data;
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
      this.updateCambios();
    } else {
      this.createCambios();
    }
  }

  updateCambios() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaInicio: new Date(this.formularioForm.value.fechaInicio)
          .toISOString()
          .split('T')[0],
        fechaFinal: new Date(this.formularioForm.value.fechaFinal)
          .toISOString()
          .split('T')[0],
      });
      this.productivityService
        .Update('update-project', this.formularioForm.value)
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
              error.message
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
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaInicio: new Date(this.formularioForm.value.fechaInicio)
          .toISOString()
          .split('T')[0],
        fechaFinal: new Date(this.formularioForm.value.fechaFinal)
          .toISOString()
          .split('T')[0],
      });
      this.productivityService
        .Create('create-project', this.formularioForm.value)
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
              'Error al crear el registro',
              error.message
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
