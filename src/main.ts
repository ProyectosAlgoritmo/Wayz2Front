import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http'; // Importa el proveedor de HttpClient
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; // Importa JwtHelperService
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // Importa las rutas
import { provideAnimations } from '@angular/platform-browser/animations';


bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),  // Inicializa Firebase
    provideFirestore(() => getFirestore())
    , provideHttpClient(), provideAnimations(),
    JwtHelperService, // Proveedor de JwtHelperService
    provideRouter(routes), 
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  ],
}).catch(err => console.error(err));