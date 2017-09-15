import { ClarityModule } from 'clarity-angular';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';

import { ApiService } from './services/api.service';
import { StorageService } from './services/local-storage.service';
import { UserService } from './services/user.service';
import { Pagination } from './pagination/pagination';

import { LocalStorageModule } from 'angular-2-local-storage';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';

import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutesComponent } from './dashboard/routes/routes.component';


import { NotLoggedInGuard } from './app-routing.module';
import { LoggedInGuard } from './app-routing.module';
import { Permissions } from './app-routing.module';
import { CarsComponent } from './dashboard/cars/cars.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { WelcomeDashboardComponent } from './dashboard/welcome-dashboard/welcome-dashboard.component';

import { ProfilePageComponent } from './profile-page/profile-page.component';

import { RouteBrowserComponent } from './route-browser/route-browser.component';
import { RequestsComponent } from './dashboard/requests/requests.component';
import { SubscriptionsComponent } from './dashboard/subscriptions/subscriptions.component';



@NgModule({
  declarations: [
    AppComponent,
    CarsComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    RoutesComponent,
    SettingsComponent,
    WelcomeDashboardComponent,
    RouteBrowserComponent,
    RequestsComponent,
    SubscriptionsComponent,
    ProfilePageComponent,
    RouteBrowserComponent

  ],
  imports: [
    ClarityModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    LocalStorageModule.withConfig({
            prefix: 'together-to-work',
            storageType: 'localStorage'
        }),
    FormsModule,
    ReactiveFormsModule,
    NguiAutoCompleteModule
  ],
  providers: [
    ApiService,
    StorageService,
    UserService,

    Pagination,

    NotLoggedInGuard,
    LoggedInGuard,
    Permissions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
