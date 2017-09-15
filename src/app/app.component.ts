import { Injectable, Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { StorageService } from  './services/local-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  username:string;
  newRequests:number;

  constructor(private ttw_apiService:ApiService,
              private localStorage:LocalStorageService,
              private ttw_userService:UserService,
              private ttw_storageService:StorageService){
                this.username = "";
                this.newRequests = null;
              }

  ngOnInit(){
    console.log('hello');

    this.ttw_apiService.getCurrentUser()
                    .subscribe(
                      user => {
                        console.log('curr user:', user);
                        this.ttw_storageService.setUser(user);
                        this.username = user['username'];
                        console.log('curr user:', this.ttw_storageService.getUser());
                      }
                    );

    this.ttw_apiService
        .countNewRequests()
        .then( count => {
          console.log(count);
          this.ttw_storageService.setNewRequestsCount(count);
          this.newRequests = count > 0 ? count : null;
        })
        .catch( err =>{
          this.ttw_storageService.setNewRequestsCount(0);
        });

        this.ttw_storageService
            .newRequestsCount
            .subscribe( newCount => this.newRequests = newCount as number);

  }

  isLoggedIn(){
    // console.log('check', this.localStorage.get('user'));
    if(this.localStorage.get('user') == null || this.localStorage.get('user') == undefined) return false;
    return Object.keys(this.localStorage.get('user')).length == 0 ? false : true;
  }


}
