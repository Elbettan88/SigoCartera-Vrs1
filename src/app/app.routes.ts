import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CargaExcelComponent } from './components/carga-excel/carga-excel';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'carga-excel', component: CargaExcelComponent },
  { path: '**', redirectTo: 'login' }
];
