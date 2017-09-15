import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';
import { ApiService } from '../services/api.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService:UserService, private apiService:ApiService, private router:Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.apiService
               .isLoggedIn()
               .map(
                    res => {
                      let isLogged = res.json();
                        if(!isLogged){
                          this.router.navigate(['/login']);
                        }
                        return isLogged;
                    },
                    err => {return false }
                  )



  }
}
