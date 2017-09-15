
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';


@Injectable()
export class NotLoggedGuard implements CanActivate {

  constructor(
    private userService:UserService,
    private router:Router,
    private apiService:ApiService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.apiService.isLoggedIn()
      .map(
        res => {
          console.log(res.json());
          let isLogged = res.json();
          if(isLogged){
            this.router.navigate(['/dashboard']);
          }
          return !isLogged;
        },
        err => {return true }
      )

  }
}
