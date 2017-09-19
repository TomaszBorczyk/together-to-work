import { Injectable } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import * as _ from 'underscore';
import { Car } from '../models/car.model';
import { RouteRequest, RouteRequestRes } from '../models/request.model';
import { Route } from '../models/route.model';
import { User } from '../models/user.model';
import { StorageService } from './local-storage.service';

@Injectable()
export class ApiService {
  // apiServer:string = 'http://127.0.0.1:4567';
  apiServer: string = 'http://localhost:4567/api/v1';

  constructor(
    private http: Http,
    private router: Router,
    private localStorage: LocalStorageService,
    private ttw_storageService: StorageService
  ) { };

  //=======================
  // AUTHENTICATION & USER
  //=======================

  customLogin() {
    const body = { username: 'john', password: 'pass'};

    this.http.post(this.apiServer + '/user/login', body)
              .subscribe( res => {
                  this.ttw_storageService.setUser(res.json().user);
                  window.location.reload();
                },
                err => console.log(err)
              );
  }

  login(username: string, password: string):Promise< void |object> {
    const body = { username: username, password: password};

    return this.http.post(this.apiServer + '/user/login', body)
             .toPromise()
             .then( res => {
                    console.log('LOGGED IN');
                    this.ttw_storageService.setUser(res.json());
                    window.location.reload();
                  }
              )
             .catch( err => { throw err; } );
  }

  registerUser(user:User){
    const body = { username: user.username,
                 email: user.email,
                 password: user.password
               };

     this.http.post(this.apiServer + '/user/register', body)
      .subscribe( res => {
          if(res.json().success){
            window.location.reload();
          }
        },
        err => console.log(err)
      );
  }

  getUser(id:string):Promise<any>{
    let URLparams:URLSearchParams = new URLSearchParams();
    URLparams.set('userid', id);
    return this.http.get(this.apiServer + '/user/getuser', {search: URLparams})
                    .toPromise()
                    .then(
                      res => {
                        let json = res.json();
                        console.log('server user response',json);
                        if(json.success === false)
                          {
                          return "ERROR";
                          }else{
                          return json;
                          }
                      }
                    )
  }

  logout(){
    this.http.get(this.apiServer + '/auth/logout')
             .toPromise()
             .then( res => {
                 this.ttw_storageService.setUser('')
                 window.location.reload();
               }
             );
  }

  isLoggedIn(){
    return this.http.get(this.apiServer + '/auth/isloggedin')
  }

  getCurrentUser():Observable<string>{
    return this.http.get(this.apiServer + '/auth/curr')
                    .map(res => res.json());
  }

  changePassword(username:string, actualPass:string, newPass:string):Promise<boolean>{
    let body = { username: username, password: actualPass, new_password: newPass };
    return this.http.post(this.apiServer + '/user/changepassword', body)
        .toPromise()
        .then( res => {
            let json = res.json();
            if(json.success === true){
              return json.success;
            }
            else throw 'password not changed';
          }
        );
  }

  //=======================
  //      ROUTES
  //=======================

  addRoute(route:Route):Promise<Route>{
    console.log(route);
    return this.http.post(this.apiServer + '/user/addroute', {route: route})
      .toPromise()
      .then( res => {
          let json = res.json();
          if(json.success === true){
            route._id = json.route.id;
            return route;
          }
          // else throw 'could not get response from db';
          else throw json.err;
        }
      );
  }

  removeRoute(routeId:string):Promise<boolean>{
    return this.http.post(this.apiServer + '/user/removeroute', {route:{id: routeId}})
      .toPromise()
      .then( res => {
          let json = res.json();
          if(json.success === true){
            return json.success;
          }
          else throw 'removing route failed';
        }
      );
  }

  getRoutes():Promise<Array<Route>>{
    return this.http.get(this.apiServer + '/user/getroutes')
      .toPromise()
      .then( res => {
          let json = res.json();
          return json.routes;
        }
      )
  }

  findRoutes(params:object):Promise<Array<Route>>{
    let body = {};

    Object.keys(params).map(
      key => {
        if(params[key].slice() !== null && params[key].slice() !== ""){
          body[key] = params[key];
        }
      }
    )

    console.log('body',body);

    return this.http
       .post(this.apiServer + '/route/findroutes', body)
       .toPromise()
       .then( res => {
           if(res.json().success === true){
             let routes = res.json().routes;
             console.log(routes);
             return routes;
           }
           else{
             return [];
           }
         }
       )
  }


  getSubscribedRoutesIds():Promise<Array<string>>{
    return this.http.get(this.apiServer + '/user/getsubscribedroutesids')
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.routes;
        }
        else throw json.err;
      })
  }

  //=======================
  //        CARS
  //=======================

  addCar(car:Car):Promise<Car>{
    console.log(car);
    return this.http.post(this.apiServer + '/user/addcar', { car: car})
      .toPromise()
      .then( res => {
          let json = res.json();
          if(json.success === true){
            car._id = json.car._id;
            return car;
          }
          else return null;
        }
      );
  }

  removeCar(carId:string):Promise<boolean>{
    return this.http.post(this.apiServer + '/user/removecar', {car: {id: carId}})
      .toPromise()
      .then( res => {
          let json = res.json();
          return json.success;
        }
      );
  }

  getCars():Promise<Array<Car>>{
    return this.http.get(this.apiServer + '/user/getcars')
      .toPromise()
      .then( res =>{
          let json = res.json();
          return json.cars;
        }
      );
  }

  getFiveStreetsLike(search:string):Observable<Array<string>>{
    let URLparams:URLSearchParams = new URLSearchParams();
    URLparams.set('search', search);
    return this.http.get(this.apiServer + '/street/findlike', {search: URLparams})
      .map( res => res.json().streets)
      .map( streets => {
          let namesArray = streets.map(street => street.name);
          return namesArray;
        }
      )
  }

  //=======================
  //      RATING
  //=======================

  addRating(value:number, comment:string, id:string){
    return this.http.post(this.apiServer + '/user/addrating', {rating: {value: value, comment: comment, id: id}})
      .toPromise()
      .then(
        res => {
          let json = res.json();
          if(json.success === false)
            {
              return false;
            } else {
              return json;
            }
        }
      )
  }

  //=======================
  //        REQUESTS
  //=======================
  addRequest(driver_id:string, route_id:string):Promise<object>{
    let body = { driver_id: driver_id, route_id: route_id};

    return this.http
      .post(this.apiServer + '/request/add', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true) return {success: true};
        else return {success: false};
      })
  }

  getRequestsAs(who:string):Promise<Array<RouteRequestRes>>{
    return this.http
      .get(this.apiServer + '/request/getfor' + who)
      .toPromise()
      .then( res => {
          console.log(res);
          let json = res.json();
          if(json.success === true){
            console.log('success');
            return json.requests;
          } else{
            console.log(json.msg);
            return [];
          }
        }
      );
  }

  solveRequestAndMarkAs(decision:boolean, request_id:string):Promise<boolean>{
    let body = {decision: decision, request_id: request_id};

    return this.http
      .post(this.apiServer + '/request/solve', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else throw json.msg;
      })
  }


  acceptRequest(requestId:string):Promise<boolean>{
    let body = { request_id: requestId};
    return this.http.post(this.apiServer + '/request/accept', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else return false;
      })
  }

  declineRequest(requestId:string):Promise<boolean>{
    let body = { request_id: requestId};
    return this.http.post(this.apiServer + '/request/decline', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else throw json.err;
      })
  }

  cancelRequest(requestId:string):Promise<boolean>{
    let body = { request_id: requestId};
    return this.http.post(this.apiServer + '/request/cancel', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else throw json.err;
      })
  }

  areFreeSeats(requestId:string):Promise<boolean>{
    let body = { request_id: requestId};
    return this.http.post(this.apiServer + '/request/arefree', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.are_free;
        }
        else throw json.err;
      })
  }

  areUnsolvedRequests(routeId:string):Promise<boolean>{
    // let body = { passenger_id: passengerId, route_id: routeId};
    let body = { route_id: routeId };
    return this.http.post(this.apiServer + '/request/areunsolved', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.result;
        }
        else throw json.err;
      })
  }

  countResolvedtNotShown():Promise<number>{
    return this.http.get(this.apiServer + '/request/countnotshown')
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.count;
        }
        else throw json.err;
      })
  }

  countNewRequests():Promise<number>{
    return this.http.get(this.apiServer + '/request/countnew')
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.count;
        }
        else throw json.err;
      })
  }

  markAllAsShown():Promise<boolean>{
    return this.http.post(this.apiServer + '/request/markshownall', {})
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else throw json.err;
      })
  }

  //=======================
  //     SUBSCRIPTION
  //=======================
  getSubscribedRoutes():Promise<Array<Route>>{
    return this.http.get(this.apiServer + '/user/getsubscribedroutes')
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return json.routes;
        }
        else throw json.err;
      })
  }

  cancelSubscribedRoute(routeId:string):Promise<boolean>{
    let body = { route_id: routeId };
    return this.http.post(this.apiServer + '/user/removesub', body)
      .toPromise()
      .then( res => {
        let json = res.json();
        if(json.success === true){
          return true;
        }
        else throw json.err;
      })
  }

  getAvgRating(id:string){
    let URLparams:URLSearchParams = new URLSearchParams();
    URLparams.set('userid', id);
    return this.http.get(this.apiServer + '/user/getavgrating', {search: URLparams})
                    .toPromise()
                    .then(
                      res => {
                        let json = res.json();
                        if(json.success === false)
                          {
                            return null;
                          } else {
                            let rating = Math.round(json.values[0].RatingsAvg*100)/100;
                            return rating;
                          }
                      }
                    )
  }

}
