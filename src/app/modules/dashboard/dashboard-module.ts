import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { RouterModule } from '@angular/router';
import { Dashboard } from './dashboard';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    Dashboard,
    DashboardHome
  ],
})
export class DashboardModule { }
