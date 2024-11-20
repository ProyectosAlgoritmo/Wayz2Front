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
import { AuxService } from '../../../../services/aux-service.service';
import { UsersService } from '../../../../services/users.service';
import { SharedModule } from '../../../shared/shared.module';
import { parseISO } from 'date-fns';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
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
export class CreateUserComponent implements OnInit {
  formularioForm: FormGroup;
  roles: any;
  date = null;
  titulo = 'Crear proyecto';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateUserComponent>
  ) {
    this.formularioForm = this.fb.group({
      idUsuario: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      username: ['', Validators.required],
      tipoIdentificacion: ['', Validators.required],
      identificacion: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      fechaIngresoEmpresa: [null, Validators.required],
      idRol: [null, Validators.required],
      bActivo: [false, Validators.required],
    });
    if (this.data) {
      this.titulo = 'Editar usuario';
      this.formularioForm.patchValue({
        idUsuario: this.data.idUsuario || 0,
        nombre: this.data.nombre || '',
        apellido: this.data.apellido || '',
        correoElectronico: this.data.correoElectronico || '',
        telefono: this.data.telefono || '',
        username: this.data.username || '',
        tipoIdentificacion: this.data.tipoIdentificacion || '',
        identificacion: this.data.identificacion || '',
        fechaNacimiento: this.data.fechaNacimiento ? parseISO(this.data.fechaNacimiento) : null,
        fechaIngresoEmpresa: this.data.fechaIngresoEmpresa ? parseISO(this.data.fechaIngresoEmpresa) : null,
        idRol: this.data.idRol || 0,
        bActivo: this.data.bActivo || false,
      });
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getRole();
  }
  ngOnInit() {}

  onChange(result: any): void {
    console.log('onChange: ', result);
  }


  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.bActivo = this.data.bActivo ? 'activo' : 'inactivo';
    }
  }

  getRole() {
    this.usersService.get('get-roles').subscribe({
      next: (data: any) => {
        if (data) {
          this.roles = data.data;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error:any) => {
        this.auxService.AlertError('Error al cargar los roles:', error);
      },
    });
  }

  guardarCambios() {
    if (this.data) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  updateUser() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaNacimiento: new Date(this.formularioForm.value.fechaNacimiento)
          .toISOString()
          .split('T')[0],
        fechaIngresoEmpresa: new Date(this.formularioForm.value.fechaIngresoEmpresa)
          .toISOString()
          .split('T')[0],
      });
      this.usersService
        .Update('update-user', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
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
          error: (error:any) => {
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
  createUser() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.formularioForm.patchValue({
        fechaNacimiento: new Date(this.formularioForm.value.fechaNacimiento)
          .toISOString()
          .split('T')[0],
        fechaIngresoEmpresa: new Date(this.formularioForm.value.fechaIngresoEmpresa)
          .toISOString()
          .split('T')[0],
      });
      this.usersService
        .Create('create-user', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos registrados correctamente',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error al crear el registro',
                data.message
              );
            }
          },
          error: (error:any) => {
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
