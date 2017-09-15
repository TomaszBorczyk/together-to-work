import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class StorageService {
  user = new Subject();
  newRequestsCount = new Subject();

  constructor(private localStorageService:LocalStorageService) { }

  obsUser(){
    return this.user.asObservable();
  }

  setUser(value) {
    this.user.next(value); // this will make sure to tell every subscriber about the change.
    this.localStorageService.set('user', value);
    console.log('user set');
  }

  getUser():string {
    return this.localStorageService.get('user') as string;
  }

  setNewRequestsCount(value:number){
    this.newRequestsCount.next(value);
    this.localStorageService.set('newRequestsCount', value);
  }

  getNewRequestsCount() {
    return parseInt(this.localStorageService.get('newRequestsCount') as string);
  }


}
