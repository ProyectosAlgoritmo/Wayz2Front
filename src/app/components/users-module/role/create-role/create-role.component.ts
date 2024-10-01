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
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css'],
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
export class CreateRoleComponent implements OnInit {
  formularioForm: FormGroup;
  roles: any;
  date = null;
  titulo = 'Crear rol';
  isReadonly: boolean = true;
  estapaDisabled: boolean = true;

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateRoleComponent>
  ) {
    this.formularioForm = this.fb.group({
      idRol: [null],
      rol: ['', Validators.required],
      
    });
    if (this.data) {
      this.titulo = 'Editar rol';
      this.formularioForm.patchValue({
        idRol: this.data.idRol || 0,
        rol: this.data.rol || ''
      });
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
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
      this.usersService
        .Update('update-role', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
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
      this.usersService
        .Create('create-role', this.formularioForm.value)
        .subscribe({
          next: async (data:any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Datos registrados correctamente',
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
