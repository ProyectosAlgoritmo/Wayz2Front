import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { KeyperformanindicatorsComponent } from './components/keyperformanindicators/keyperformanindicators.component';
import { LoginComponent } from './components/authorization/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ImportComponent } from './components/import/import.component';
import { ClientComponent } from './components/config/client/client.component';
import { BusinessunitComponent } from './components/config/businessunit/businessunit.component';
import { ProductsservicesComponent } from './components/config/productsservices/productsservices.component';
import { ZoneComponent } from './components/config/zone/zone.component';
import { SupervisorComponent } from './components/config/supervisor/supervisor.component';
import { IncomeComponent } from './components/financialperformance/income/income.component';
import { ExpensesComponent } from './components/financialperformance/expenses/expenses.component';
import { BalanceComponent } from './components/config/balance/balance.component';
import { TableWithRowsChildComponent } from './components/shared/table-with-rows-child/table-with-rows-child.component';
import { TypebalanceComponent } from './components/config/balance/typebalance/typebalance.component';

export const routes: Routes = [

    { path: '', component: HomeComponent, canActivate: [AuthGuard], data: { requireIdEmpresa: false }}, 
    { path: 'dashboard', component: KeyperformanindicatorsComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true } },
    { path: 'login', component: LoginComponent },
    { path: 'import', component: ImportComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'clients', component: ClientComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'businessunit', component: BusinessunitComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'productsServices', component: ProductsservicesComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'zones', component: ZoneComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'supervisor', component: SupervisorComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'balance', component: BalanceComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'typebalance', component: TypebalanceComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },

    { path: 'table', component: TableWithRowsChildComponent  },

    // desempeño financiero

    { path: 'Income', component: IncomeComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'Expenses', component: ExpensesComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
];
