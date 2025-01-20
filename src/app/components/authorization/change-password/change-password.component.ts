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
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AuxService } from '../../../services/aux-service.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
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
export class ChangePasswordComponent implements OnInit {
  changeForm: FormGroup;
  hidePassword = true;
  private accesoServicio = inject(AuthService);
  isLogged = false;
  hide = true;
  token = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private auxService: AuxService
  ) {
    this.changeForm = this.fb.group({
      rpassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.isLogged = this.authService.isAuthenticatedBool();

    if (this.isLogged) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.changeForm.valid) {
      const password = this.changeForm.value.password;
      const rpassword = this.changeForm.value.password;

      if (password !== rpassword) {
        this.auxService.AlertWarning(
          'Password Change',
          'The passwords do not match'
        );
        return;
      }

      if (password == localStorage.getItem("cambio")) {
        this.auxService.AlertWarning(
          'Password Change',
          'The password cannot be the same as your identification.'
        );
        return;
      }


      this.auxService.ventanaCargando();

      this.accesoServicio
        .changePassword('Auth/change-password', password, this.token)
        .subscribe({
          next: (data) => {
            if (data.success) {
              if(localStorage.getItem("cambio") != null){
                localStorage.removeItem("cambio");
                sessionStorage.setItem('token', this.token);
              }
              this.router.navigate(['/']);
              this.auxService.AlertWarning('Password Change', data.message);
              //this.auxService.cerrarVentanaCargando();
            } else {
              this.auxService.cerrarVentanaCargando();
              this.auxService.AlertWarning('Password Change', data.message);
              //alert("Error desconocido");
            }
          },
          error: (error) => {
            this.auxService.cerrarVentanaCargando();
          },
        });
    }
  }
}
