import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { KeyperformanindicatorsComponent } from './components/keyperformanindicators/keyperformanindicators.component';
import { LoginComponent } from './components/authorization/login/login.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [

    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, 
    { path: 'dashboard', component: KeyperformanindicatorsComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },

];
