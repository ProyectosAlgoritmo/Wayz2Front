import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { KeyperformanindicatorsComponent } from './components/keyperformanindicators/keyperformanindicators.component';
import { LoginComponent } from './components/authorization/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ImportComponent } from './components/import/import.component';
import { ClientComponent } from './components/config/client/client.component';
import { BusinessunitComponent } from './components/config/businessunit/businessunit.component';
import { SupervisorComponent } from './components/config/supervisor/supervisor.component';
// import { BalanceComponent as Balance} from './components//financialperformance/cash-flow/cash-flow.component';
import { TableWithRowsChildComponent } from './components/shared/table-with-rows-child/table-with-rows-child.component';
import { PowerBiReportComponent } from './components/powerbi-report/powerbi-report.component'; // Importa el componente
import { ActivitylogComponent } from './components/activitylog/activitylog.component';
import { UsersComponent } from './components/users-module/users/users.component';
import { UsersModuleComponent } from './components/users-module/users-module.component';
import { RecoveryPasswordComponent } from './components/authorization/recovery-password/recovery-password.component';
import { ChangePasswordComponent } from './components/authorization/change-password/change-password.component';
import { MachineComponent } from './components/config/machine/machine.component';
import { CrewsComponent } from './components/crews/crews.component';
import { NewCrewComponent } from './components/crews/new-crew/new-crew.component';
import { ProductsComponent } from './components/config/products/products.component';
import { CategorysComponent } from './components/config/categorys/categorys.component';
import { TooComponent } from './components/config/too/too.component';
import { CreateTooComponent } from './components/config/too/create-too/create-too.component';
import { CreateEditTooComponent } from './components/config/too/create-edit-too/create-edit-too.component';
import { CenterlineComponent } from './components/centerline/centerline.component';
import { LimitsAndTargetsComponent } from './components/limits-and-targets/limits-and-targets.component';
import { UpdateTargetAndLimitsProductComponent } from './components/limits-and-targets/update-target-and-limits-product/update-target-and-limits-product.component';
import { DataEntryComponent } from './components/data-entry/data-entry/data-entry.component';
import { TablaOrdenableComponent } from './components/shared/tabla-ordenable/tabla-ordenable.component';
import { ArrangeComponent } from './components/arrange/arrange.component';
import { DataEntryFileComponent } from './components/data-entry/data-entry-file/data-entry-file.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: false },
  },
  {
    path: 'dashboard',
    component: KeyperformanindicatorsComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },
  { path: 'login', component: LoginComponent },
  { path: 'recovery-password', component: RecoveryPasswordComponent },
  { path: 'change-password/:token', component: ChangePasswordComponent },
  {
    path: 'import',
    component: ImportComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },
  {
    path: 'clients',
    component: ClientComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },
  {
    path: 'businessunit',
    component: BusinessunitComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },
  {
    path: 'supervisor',
    component: SupervisorComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },

  { path: 'table', component: TableWithRowsChildComponent },
  {
    path: 'users',
    component: UsersModuleComponent,
    canActivate: [AuthGuard],
    data: { requireIdEmpresa: true },
  },

  // desempeño financiero
  {
    path: 'reporte/:pageName',
    component: PowerBiReportComponent,
    canActivate: [AuthGuard],
  }, 
  { path: 'machines', component: MachineComponent, canActivate: [AuthGuard] }, 
  { path: 'crews', component: CrewsComponent, canActivate: [AuthGuard] }, 
  { path: 'new-crews', component: NewCrewComponent, canActivate: [AuthGuard] }, 
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] }, 
  { path: 'categories', component: CategorysComponent, canActivate: [AuthGuard] }, 
  { path: 'too', component: TooComponent, canActivate: [AuthGuard] }, 
  { path: 'create-too', component: CreateTooComponent, canActivate: [AuthGuard] }, 
  { path: 'create-edit-too/:id', component: CreateEditTooComponent, canActivate: [AuthGuard] }, 
  { path: 'machines', component: MachineComponent, canActivate: [AuthGuard] },
  { path: 'crews', component: CrewsComponent, canActivate: [AuthGuard] },
  { path: 'new-crews', component: NewCrewComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  { path: 'data-entry/:id', component: DataEntryComponent, canActivate: [AuthGuard] },
  { path: 'data-entry-file', component: DataEntryFileComponent, canActivate: [AuthGuard] },
  { path: 'drop', component: TablaOrdenableComponent, canActivate: [AuthGuard] },
  {
    path: 'categories',
    component: CategorysComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'centerline',
    component: CenterlineComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limits-and-targets',
    component: LimitsAndTargetsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'arrange',
    component: ArrangeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activitylog',
    component: ActivitylogComponent,
    canActivate: [AuthGuard],
  },
];
