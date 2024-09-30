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

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AuxService } from '../../services/aux-service.service';
import { PermisosService } from '../../services/permisos.service';
import { DateService } from '../../services/data-service.service';
import { SharedModule } from '../shared/shared.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-create-enterprise',
  templateUrl: './create-enterprise.component.html',
  styleUrls: ['./create-enterprise.component.css'],
  standalone: true,
  imports: [
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NzFormModule,
    NzDatePickerModule,
    NzSwitchModule,
    SharedModule,
    NzStepsModule,
  ],
})
export class CreateEnterpriseComponent implements OnInit {
  formularioForm: FormGroup;
  lideres: any;
  zona: any;
  unidades: any;
  etapas: any;
  date = null;
  titulo = 'Crear Empresa';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private permisosService: PermisosService,
    private auxService: AuxService,
    private dateService: DateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateEnterpriseComponent>
  ) {
    this.formularioForm = this.fb.group({
      // Datos de la empresa
      idEmpresa: [0, ],
      industria: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      pais: ['', Validators.required],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
      codigoPostal: [null], // Puede ser opcional, depende de los requisitos
      direccionEmpresa: ['', Validators.required],
      telefonoEmpresa: ['', Validators.required],
      correoEmpresa: ['', [Validators.required, Validators.email]],

      // Datos del Gerente
      nombreGerente: ['', Validators.required],
      apellidoGerente: ['', Validators.required],
      telefonoGerente: ['', Validators.required],
      correoGerente: ['', [Validators.required, Validators.email]],

      // Datos del Responsable
      nombreResponsable: ['', Validators.required],
      apellidoResponsable: ['', Validators.required],
      telefonoResponsable: ['', Validators.required],
      correoResponsable: ['', [Validators.required, Validators.email]],
      cargoResponsable: ['', Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar Empresa';
      this.getEnterprise();
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  getEnterprise() {
    this.auxService.ventanaCargando();
    this.permisosService.GetEnterprise(this.data.idclient).subscribe({
      next: (data) => {
        if (data.success) {
          console.log('data', data);
          this.auxService.cerrarVentanaCargando();
            this.formularioForm.patchValue({
              // Datos de la empresa
              idEmpresa: data.data.idEmpresa,
              industria: data.data.industria,
              nombreEmpresa: data.data.nombreEmpresa,
              pais: data.data.pais,
              departamento: data.data.departamento,
              ciudad: data.data.ciudad,
              codigoPostal: data.data.codigoPostal,
              direccionEmpresa: data.data.direccionEmpresa,
              telefonoEmpresa: data.data.telefonoEmpresa,
              correoEmpresa: data.data.correoEmpresa,

              // Datos del Gerente
              nombreGerente: data.data.nombreGerente,
              apellidoGerente: data.data.apellidoGerente,
              telefonoGerente: data.data.telefonoGerente,
              correoGerente: data.data.correoGerente,

              // Datos del Responsable
              nombreResponsable: data.data.nombreResponsable,
              apellidoResponsable: data.data.apellidoResponsable,
              telefonoResponsable: data.data.telefonoResponsable,
              correoResponsable: data.data.correoResponsable,
              cargoResponsable: data.data.cargoResponsable,
            });
        } else {
          this.auxService.ventanaCargando();
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
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

  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.estado = this.data.estado ? 'activo' : 'inactivo';
    }
  }

  guardarCambios() {
    if (this.data) {
      this.updateEnterprise();
    } else {
      this.createEnterprise();
    }
  }

  updateEnterprise() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.permisosService
        .UpdateEnterprise(this.formularioForm.value)
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

  createEnterprise() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();

      this.permisosService
        .CreateEnterprise(this.formularioForm.value)
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

  /**/
  current = 0;

  index = 'First-content';

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }
  /**/
}
