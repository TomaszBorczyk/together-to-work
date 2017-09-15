import { Injectable, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { StorageService } from '../../services/local-storage.service';

import { RouteRequest, RouteRequestRes } from '../../models/request.model';
import { Days } from '../../models/route.model';
import { Helper } from '../../helper/helper';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  requestsReceived:Array<RouteRequestRes>;
  requestsSent:Array<RouteRequestRes>;
  helper:Helper;

  constructor(
    private ttw_apiService:ApiService,
    private ttw_storageService:StorageService
  ) {
    this.requestsReceived = [];
    this.requestsSent = [];
    this.helper = new Helper();

    this.ttw_apiService
      .getRequestsAs('passenger')
      .then( requests => requests.map( request => {
        this.requestsSent.push(<RouteRequestRes>request);
      }  ))
      .then( res => this.requestsSent.forEach( request => console.log('passenger', request )) );

    this.ttw_apiService
      .getRequestsAs('driver')
      .then( requests => requests.map( request => {
        this.requestsReceived.push(<RouteRequestRes>request);
      }  ))
      .then( res => this.requestsReceived.forEach( request => console.log('driver', request )) );
  }

  ngOnInit() {
  }

  acceptRequest(request:RouteRequestRes){
    this.ttw_apiService
      .acceptRequest(request._id)
      .then(success => {
        let index = this.requestsReceived.indexOf(request);
        this.requestsReceived[index].is_solved = true;
        this.requestsReceived[index].is_accepted = true;
        this.requestsReceived.splice(index, 1);
        this.decreaseNewRequestCount();
      })
      .catch(err => console.log('err', err));
  }

  declineRequest(request:RouteRequestRes){
    this.ttw_apiService
      .declineRequest(request._id)
      .then(success => {
        let index = this.requestsReceived.indexOf(request);
        this.requestsReceived[index].is_solved = true;
        this.requestsReceived[index].is_accepted = false;
        this.requestsReceived.splice(index, 1);
        this.decreaseNewRequestCount();
      })
      .catch(err => console.log('err', err));
  }

  cancelRequest(request:RouteRequestRes){
    this.ttw_apiService
      .cancelRequest(request._id)
      .then( success => {
        let index = this.requestsSent.indexOf(request);
        this.requestsSent.splice(index, 1);
      })
      .catch( err => console.log(err));
  }

  decreaseNewRequestCount(){
    let requestCount = this.ttw_storageService.getNewRequestsCount();
    requestCount--;
    if(requestCount<=0) requestCount = null;
    this.ttw_storageService.setNewRequestsCount(requestCount);

  }

}
