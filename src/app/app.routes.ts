import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { KeyperformanindicatorsComponent } from './components/keyperformanindicators/keyperformanindicators.component';

export const routes: Routes = [

    {path:'',component:HomeComponent}, 
    { path: 'dashboard', component: KeyperformanindicatorsComponent },

];
