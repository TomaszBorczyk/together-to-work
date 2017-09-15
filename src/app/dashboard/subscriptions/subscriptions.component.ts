import { Injectable, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/local-storage.service';


import { RouteRequest, RouteRequestRes } from '../../models/request.model';
import { Route, Days } from '../../models/route.model';
import { Helper } from '../../helper/helper';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  subscribedRoutes:Array<Route>;

  constructor(
    private ttw_apiService:ApiService,
    private ttw_storageService:StorageService
  ) {
    this.subscribedRoutes = [];
  }

  ngOnInit() {
    this.ttw_apiService.getSubscribedRoutes()
      .then( routes =>{
        console.log('routes', routes);
        this.subscribedRoutes = routes;
      })
      .catch( err => console.log(err));

    this.ttw_apiService.markAllAsShown()
      .then( success =>{
        // this.ttw_storageService.setRoutesCount(0)

      } )
      .catch( err => console.log(err));

  }

  cancelSubscribedRoute(route:Route){
    let routeId = route._id;
    this.ttw_apiService.cancelSubscribedRoute(routeId)
      .then( success => {
        let index = this.subscribedRoutes.indexOf(route);
        this.subscribedRoutes.splice(index, 1);
      })
      .catch( err => console.log('err', err));
  }

  getAsArray(days:Days):Array<object>{
    let daysArray:Array<object> = [];
    Object.keys(days).forEach( (key, i) => {
      daysArray.push({name: key, value: days[key]})
    })
    return daysArray;
  }

}
