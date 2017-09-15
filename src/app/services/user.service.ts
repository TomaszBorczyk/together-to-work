import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Car } from '../models/car.model';
import { LocalStorageService } from 'angular-2-local-storage';
import { StorageService } from  './local-storage.service';

@Injectable()
export class UserService {

  user:User;
  constructor(private localStorage:LocalStorageService) {
  }

  isLoggedIn(){
    if(this.localStorage.get('user') == null || this.localStorage.get('user') == undefined) return false;
    return Object.keys(this.localStorage.get('user')).length == 0 ? false : true;
  }

  getLocalStorageUser():object{
    return this.localStorage.get('user') as object;
  }

  getUsername():string{
    return this.localStorage.get('user')['username'];
  }
  getID():string{
    return this.localStorage.get('user')['_id'];
  }

  getCars():Array<Car>{
    let carsString:Array<string> = <Array<string>>this.localStorage
                                                      .get('user')['cars'];

    let cars:Array<Car> = carsString.map( car =>{
                                                 let newCar:Car = new Car(car['_id'],
                                                                          car['name'],
                                                                          car['color'],
                                                                          car['seats'],
                                                                          car['description']
                                                                         );
                                                 console.log(newCar);
                                                 return newCar;
                                               }
                                         )
    return cars;
  }

}
