import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  private accesoServicio = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Value:', this.loginForm.value);
      // Lógica de inicio de sesión aquí

      this.accesoServicio.login("prueba", "prueba").subscribe({
        next:(data) => {
          if(data.isSuccess){
            //guardamos en el local storage del navegador el token
            //que devuelve la api (/pai/InicioSesion)
            localStorage.setItem("token", data.token);
            
          }else{
            //Aviso de que las credenciales son incorretas
            alert("Correo/contraseña incorrectas");
          }
        },
        error: (error) => {
          console.log(error.message);
        },
      })


    }
  }
}
