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
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { AuxService } from '../../../services/aux-service.service';

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
  isLogged = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private auxService: AuxService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  ngOnInit() {
    this.isLogged = this.authService.isAuthenticatedBool();

    if (this.isLogged) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      
      this.accesoServicio.login(email, password).subscribe({
        next:(data) => {
          if(data.success){
             //this.auxService.AlertWarning("Inicia Sesión",data.message); 
             if(data.message == "Credenciales correctas"){
              //this.auxService.ventanaCargando();
              this.router.navigate(['/dashboard']);
             }else{
              this.auxService.ventanaCargando();
              this.auxService.AlertWarning("Inicia Sesión",data.message); 
             }

          }else{
            alert("Error desconocido");
          }
        },
        error: (error) => {
          console.log(error.message);
        },
      })


    }
  }
}
