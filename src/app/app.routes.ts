import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { KeyperformanindicatorsComponent } from './components/keyperformanindicators/keyperformanindicators.component';
import { LoginComponent } from './components/authorization/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ImportComponent } from './components/import/import.component';
import { ClientComponent } from './components/client/client.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { requireIdEmpresa: false }}, 
    { path: 'dashboard', component: KeyperformanindicatorsComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true } },
    { path: 'login', component: LoginComponent },
    { path: 'import', component: ImportComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'clients', component: ClientComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },

];
