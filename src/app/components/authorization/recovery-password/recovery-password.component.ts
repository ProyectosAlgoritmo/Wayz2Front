import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuxService } from '../../../services/aux-service.service';
import { SharedModule } from '../../shared/shared.module';
import { ro } from 'date-fns/locale';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    SharedModule,
  ],
})
export class RecoveryPasswordComponent implements OnInit {
  recoveryForm: FormGroup;
  hidePassword = true;
  private accesoServicio = inject(AuthService);
  isLogged = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private auxService: AuxService
  ) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      url: [this.url(), [Validators.required]],
      rememberMe: [false],
    });
  }

  url() {
    let urlCompleta = window.location.href;

    // Definir la expresión regular para capturar la parte deseada de la URL
    let expresionRegular = /(https?:\/\/[^\/]+\/).*recovery-password/;

    // Ejecutar la expresión regular en la URL completa
    let coincidencias = expresionRegular.exec(urlCompleta);

    // Verificar si se encontraron coincidencias y obtener la parte deseada de la URL
    let ruta = coincidencias ? coincidencias[1] : '';
    return ruta;
  }

  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit() {
    this.recoveryForm.patchValue({ url: this.url()+'change-password/' });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    if (this.recoveryForm.valid) {
      const email = this.recoveryForm.value.email;
      const url = this.recoveryForm.value.url;

      this.auxService.ventanaCargando();

      this.accesoServicio.RecoveryPass(email, url).subscribe({
        next: async (data) => {
          if (data.success) {
            await this.auxService.AlertWarning('I forgot my password ', data.message);
            this.router.navigate(['/login']);
            this.auxService.cerrarVentanaCargando();
          } else {
            this.auxService.cerrarVentanaCargando();
            this.auxService.AlertWarning('I forgot my password ', data.message);
          }
        },
        error: (error) => {
          this.auxService.cerrarVentanaCargando();
          this.auxService.AlertWarning('I forgot my password ', error.message);
        },
      });
    }
  }
}
