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
import { BalanceComponent } from './components/config/balanceconfig/balance/balance.component';
// import { BalanceComponent as Balance} from './components//financialperformance/cash-flow/cash-flow.component';
import { TableWithRowsChildComponent } from './components/shared/table-with-rows-child/table-with-rows-child.component';
import { BalanceconfigComponent } from './components/config/balanceconfig/balanceconfig.component';
import { PowerBiReportComponent } from './components/powerbi-report/powerbi-report.component'; // Importa el componente
import { CashFlowComponent } from './components/financialperformance/cash-flow/cash-flow.component';
import { IncomeStatementConfigComponent } from './components/config/income-statement-config/income-statement-config.component';
import { CashFlowConfigComponent } from './components/config/cash-flow-config/cash-flow-config.component';
import { BalanceComponent as Balance } from './components/financialperformance/balance/balance.component';
import { ActivitylogComponent } from './components/activitylog/activitylog.component';
import { ResultStatusComponent } from './components/financialperformance/result-status/result-status.component';


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
    { path: 'cash-flow', component: CashFlowComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'balance', component: Balance, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'result-status', component: ResultStatusComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
   
    { path: 'table', component: TableWithRowsChildComponent  },
    { path: 'balanceconfig', component: BalanceconfigComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'incomestatementconfig', component: IncomeStatementConfigComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'cashflowconfig', component: CashFlowConfigComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },

    // desempeño financiero

    { path: 'income', component: IncomeComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'Expenses', component: ExpensesComponent, canActivate: [AuthGuard] , data: { requireIdEmpresa: true }  },
    { path: 'reporte/:pageName', component: PowerBiReportComponent, canActivate: [AuthGuard] },  // Ruta dinámica para diferentes páginas del reporte


    { path: 'activitylog', component: ActivitylogComponent, canActivate: [AuthGuard] }  // Ruta dinámica para diferentes páginas del reporte

];
 
