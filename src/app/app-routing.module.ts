import { Injectable, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiService } from './services/api.service';

import { CarsComponent } from './dashboard/cars/cars.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteBrowserComponent } from './route-browser/route-browser.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RoutesComponent } from './dashboard/routes/routes.component';
import { SubscriptionsComponent } from './dashboard/subscriptions/subscriptions.component';
import { RequestsComponent } from './dashboard/requests/requests.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { WelcomeDashboardComponent } from './dashboard/welcome-dashboard/welcome-dashboard.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';


@Injectable()
export class Permissions {
  constructor(private router:Router,
              private ttw_apiService:ApiService){
  }

  isLoggedIn():Promise<boolean> {
    return this.ttw_apiService
               .isLoggedIn()
               .toPromise()
               .then(
                res =>{
                  let isLogged = res.json();
                  return isLogged;
                 }
               )
               .catch(
                  err =>{
                    return false;
                  }
                )
  }

}

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private permissions: Permissions,
              private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
      return this.permissions.isLoggedIn()
                      .then(
                        isLogged => {
                          if(!isLogged){
                               this.router.navigate(['/login']);
                          }
                          return isLogged;
                        }
                      )
  }
}

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  constructor(private permissions: Permissions,
              private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.permissions.isLoggedIn()
                    .then(
                      isLogged => {
                        if(isLogged){
                             this.router.navigate(['/searchroutes']);
                        }
                        return !isLogged;
                      }
                    )
  }
}

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: 'register', component: RegisterComponent, canActivate: [NotLoggedInGuard]},
      { path: 'login', component: LoginComponent, canActivate: [NotLoggedInGuard]},
      { path: 'dashboard', component: DashboardComponent, canActivate: [LoggedInGuard],
        children: [
          {  path: 'welcome', component: WelcomeDashboardComponent },
          {  path: 'subscriptions', component: SubscriptionsComponent },
          {  path: 'routes', component: RoutesComponent },
          {  path: 'cars', component: CarsComponent },
          {  path: 'requests', component: RequestsComponent },
          {  path: 'settings', component: SettingsComponent },
          {  path: '', redirectTo: 'welcome', pathMatch: 'full' },
          {  path: '**', redirectTo: 'welcome', pathMatch: 'full' },
        ]
      },
      { path: 'searchroutes', component: RouteBrowserComponent, canActivate: [LoggedInGuard]},
      { path: 'profile/:id', component: ProfilePageComponent, canActivate: [LoggedInGuard]},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule{};
