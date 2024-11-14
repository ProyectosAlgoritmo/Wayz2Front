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
import { AuxService } from '../../../../services/aux-service.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { DateService } from '../../../../services/data-service.service';
import { format, parseISO } from 'date-fns';
import { el, tr } from 'date-fns/locale';

@Component({
  selector: 'app-create-board-directors-report',
  templateUrl: './create-board-directors-report.component.html',
  styleUrls: ['./create-board-directors-report.component.css'],
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
export class CreateBoardDirectorsReportComponent implements OnInit {
  formularioForm: FormGroup;
  proyectos: any;
  responsables: any;
  etapas: any;
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;
  titulo: string = 'Crear informe de junta directiva';

  constructor(
    private fb: FormBuilder,
    private productivityService: ProductivityService,
    private dateService: DateService,
    private auxService: AuxService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateBoardDirectorsReportComponent>
  ) {
    this.formularioForm = this.fb.group({
      idInforme: [0],
      nombre: [null, Validators.required],
      descripcionComite: [null, Validators.required],
      responsable: [null, Validators.required],
      porcentajeavanceProyectado: [0, Validators.required],
      porcentajeavanceReal: [0, Validators.required],
      fecha: [null, Validators.required],
      idEtapa: [null, Validators.required],
      estado: [null, Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar informe de junta directiva';
      console.log('data', this.data);
      this.formularioForm.patchValue({
        idInforme: this.data.idInforme || null,
        nombre: this.data.nombre || '',
        descripcionComite: this.data.descripcionComite || '',
        responsable: this.data.idResponsable || null,
        porcentajeavanceProyectado: this.data.porcentajeavanceProyectado || 0,
        porcentajeavanceReal: this.data.porcentajeavanceReal || 0,
        fecha: this.data.fecha ? parseISO(this.data.fecha) : null,
        idEtapa: this.data.idEtapa || null,
        estado: this.data.estado || false,
      });
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getResponsable();
    this.GetStage();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

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

  getResponsable() {
    this.dateService.cargarVendedor().subscribe({
      next: (data) => {
        if (data) {
          this.responsables = data; // Vincula los datos al formulario
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar los responsables:', error);
      },
    });
  }

  GetStage() {
    this.productivityService.get('get-stage').subscribe({
      next: (data: any) => {
        if (data) {
          this.etapas = data.data;
          if (this.data && this.data.idEtapa) {
            this.onEtapaChange(this.data.idEtapa);
          }
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        this.auxService.AlertError('Error al cargar las unidades:', error);
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
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });

      this.productivityService
        .Update('update-board-directors-report', this.formularioForm.value)
        .subscribe({
          next: async (data) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos actualizados correctamente',
                ''
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
      this.formularioForm.patchValue({
        fecha: new Date(this.formularioForm.value.fecha)
          .toISOString()
          .split('T')[0],
      });
      this.productivityService
        .Create('create-board-directors-report', this.formularioForm.value)
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
            this.auxService.AlertError('Error al crear el registro', error);
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
