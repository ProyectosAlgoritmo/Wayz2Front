import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http'; 
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; 
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),  // Inicializa Firebase
    provideFirestore(() => getFirestore()),
    provideHttpClient(), 
    provideAnimations(),
    JwtHelperService, // Proveedor de JwtHelperService
    provideRouter(routes), // Proveedor de enrutamiento con las rutas definidas en app.routes.ts
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, { provide: NZ_I18N, useValue: en_US },
  ],
}).catch(err => console.error(err));

//hola prueba
