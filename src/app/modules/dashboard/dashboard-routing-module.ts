import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard';
import { DashboardHome } from './pages/dashboard-home/dashboard-home';



const routes: Routes = [
  {
    path: '', 
    component: Dashboard,
    children: [
      { 
        path: 'home', 
        component: DashboardHome
      },
      { 
        path: 'courses', 
        loadChildren: () => import('../courses/courses-module').then(m => m.CoursesModule) 
      },
      { 
        path: 'users', 
        loadChildren: () => import('../users/users-module').then(m => m.UsersModule) 
      },
      { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
