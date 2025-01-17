import { Component, inject, Inject, OnInit } from '@angular/core';
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
import { tr } from 'date-fns/locale';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

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
  recoveryForm: FormGroup;
  roles: any;
  date = null;
  titulo = 'Create User';
  isReadonly: boolean = true;
  isEmailDisabled: boolean = false;
  isInfoPersonal: boolean = false;
  private accesoServicio = inject(AuthService);
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private auxService: AuxService,
    private usersService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialogRef: MatDialogRef<CreateUserComponent>
  ) {
    this.recoveryForm = this.fb.group({
      email: [null],
      url: [this.url(), [Validators.required]],
      rememberMe: [false],
    });
    this.isInfoPersonal = true;
    this.formularioForm = this.fb.group({
      idUsuario: [null],
      nombre: [null, Validators.required],
      apellido: [null, Validators.required],
      correoElectronico: [null, [Validators.required, Validators.email]],
      telefono: [null, Validators.required],
      idRol: [null, Validators.required],
      bActivo: [false],
    });
    this.isEnableEmail();
    if (this.data) {
      this.titulo = 'Edit User';
      this.isInfoPersonal = true;
      if (this.data.isProfile) {
        this.isInfoPersonal = false;
        this.getProfile();
      }
      this.formularioForm.patchValue({
        idUsuario: this.data.idUsuario || 0,
        nombre: this.data.nombre || '',
        apellido: this.data.apellido || '',
        correoElectronico: this.data.correoElectronico || '',
        telefono: this.data.telefono || '',
        idRol: this.data.idRol || 0,
        bActivo: this.data.bActivo || false,
      });
      this.isDisableEmail();
    }
    this.dialogRef.backdropClick().subscribe(() => {
      this.onCancel();
    });
    this.getRole();
  }
  ngOnInit() {
    this.recoveryForm.patchValue({ url: this.url() + 'change-password/' });
    console.log('url: ', this.recoveryForm.value.url);
  }

  isDisableEmail(): void {
    const emailControl = this.formularioForm.get('correoElectronico');
    if (emailControl) {
      emailControl.disable(); // Deshabilita solo el campo de email
    }
  }

  isEnableEmail(): void {
    const emailControl = this.formularioForm.get('correoElectronico');
    if (emailControl) {
      emailControl.enable(); // Habilita solo el campo de email
    }
  }

  url() {
    // Obtener la URL completa
    let urlCompleta = window.location.href;

    // Definir la expresión regular para capturar la parte deseada de la URL hasta el primer '/'
    let expresionRegular = /(https?:\/\/[^\/]+\/)/;

    // Ejecutar la expresión regular en la URL completa
    let coincidencias = expresionRegular.exec(urlCompleta);

    // Retornar la parte deseada de la URL
    return coincidencias ? coincidencias[1] : '';
  }

  // goToLogin() {
  //   this.router.navigate(['/login']);
  // }

  goToRecovery() {
    if (this.recoveryForm.valid) {
      const email = this.email;
      const url = this.recoveryForm.value.url;

      this.auxService.ventanaCargando();

      this.accesoServicio.RecoveryPass(email, url).subscribe({
        next: async (data) => {
          if (data.success) {
            await this.auxService.AlertWarning(
              'Change my password ',
              data.message
            );
            //this.router.navigate(['/login']);
            this.auxService.cerrarVentanaCargando();
          } else {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertWarning('Change my password ', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertWarning('Change my password ', error.message);
        },
      });
    }
  }

  onChange(result: any): void {
    console.log('onChange: ', result);
  }

  onCancel(): void {
    this.dialogRef.close();
    if (this.data) {
      this.data.bActivo = this.data.bActivo ? 'Active' : 'inactive';
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
      error: (error: any) => {
        this.auxService.AlertError('Error loading roles:', error);
      },
    });
  }

  getProfile() {
    this.usersService.get('get-profile').subscribe({
      next: (data: any) => {
        if (data) {
          this.titulo = 'Edit Profile';
          let profile = data.data;
          this.formularioForm.patchValue({
            idUsuario: profile.idUsuario || 0,
            nombre: profile.nombre || '',
            apellido: profile.apellido || '',
            correoElectronico: profile.correoElectronico || '',
            telefono: profile.telefono || '',
            idRol: profile.idRol || 0,
            bActivo: null,
          });
          this.email = profile.correoElectronico;
        } else {
          this.auxService.AlertWarning('Error', data.message);
        }
      },
      error: (error: any) => {
        this.auxService.AlertError('Error loading roles:', error);
      },
    });
  }

  guardarCambios() {
    // Marca todos los controles como tocados
    this.formularioForm.markAllAsTouched();

    // Fuerza la actualización de validez de cada control
    Object.keys(this.formularioForm.controls).forEach((key) => {
      this.formularioForm.get(key)?.updateValueAndValidity();
    });

    // Verifica si el formulario es válido
    if (this.formularioForm.invalid) {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
      return;
    }
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
        .Update('update-user', this.formularioForm.value)
        .subscribe({
          next: async (data: any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Data updated successfully.',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error updating the record.',
                data.message
              );
            }
          },
          error: (error: any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error updating the record.',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
    }
  }
  createUser() {
    if (this.formularioForm.valid) {
      this.auxService.ventanaCargando();
      this.usersService
        .Create('create-user', this.formularioForm.value)
        .subscribe({
          next: async (data: any) => {
            this.auxService.cerrarVentanaCargando();
            if (data.success) {
              await this.auxService.AlertSuccess(
                'Data registered successfully.',
                ''
              );
              this.dialogRef.close(true);
            } else {
              this.auxService.AlertWarning(
                'Error creating the record.',
                data.message
              );
            }
          },
          error: (error: any) => {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertError(
              'Error creating the record.',
              error.message
            );
          },
        });
    } else {
      this.auxService.AlertWarning(
        'Invalid form.',
        'Please review the fields and correct the errors.'
      );
    }
  }
}
