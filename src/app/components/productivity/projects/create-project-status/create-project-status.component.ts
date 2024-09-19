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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DateService } from '../../../../services/data-service.service';

@Component({
  selector: 'app-create-project-status',
  templateUrl: './create-project-status.component.html',
  styleUrls: ['./create-project-status.component.css'],
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
export class CreateProjectStatusComponent implements OnInit {
  formularioForm: FormGroup;
  proyectos: any;
  responsables: any;
  titulo: string = 'Crear estado de proyecto';

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private dateService: DateService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateProjectStatusComponent>
  ) {
    this.formularioForm = this.fb.group({
      idProyectoEstado: [0,Validators.required],
      idProyecto: [0,Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      comentario: [''],
      estado: [false, Validators.required],
      etapa: [null,Validators.required],
      porcentajeavanceProyectado: [0,Validators.required],
      porcentajeavanceReal: [0,Validators.required],
      responsable: [null,Validators.required],
      fechaRevision: [null,Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar estado de proyecto';
      this.formularioForm.patchValue({
        idProyectoEstado: this.data.id || null,
        idProyecto: this.data.idProyecto || null,
        nombre: this.data.nombre || '',
        descripcion: this.data.descripcion || '',
        comentario: this.data.comentario || '',
        estado: this.data.estado || false,
        etapa: this.data.etapa || '',
        porcentajeavanceProyectado: this.data.porcentajeProyectado || 0,
        porcentajeavanceReal: this.data.porcentajeReal || 0,
        responsable: this.data.idResponsable || null,
        fechaRevision: this.data.fechaRevision || null,
      });
    }
    this.getProjects();
    this.getResponsable();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getProjects() {
    this.productivityService.get('get-projects').subscribe({
      next: (data) => {
        if (data.success) {
          this.proyectos = data.data; // Vincula los datos al formulario
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los proyectos:',
          error
        );
      },
    });
  }
  
  getResponsable() {
    this.dateService.cargarVendedor().subscribe({
      next: (data) => {
        if (data) {
          this.responsables = data; // Vincula los datos al formulario
        }
      },
      error: (error) => {
        this.auxService.AlertError(
          'Error al cargar los responsables:',
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
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Update('update-project-state', this.formularioForm.value)
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
  createCambios() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();

      this.productivityService
        .Create('create-project-state', this.formularioForm.value)
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos creados correctamente',
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
