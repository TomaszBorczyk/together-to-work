import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { Pagination } from '../pagination/pagination';

import { Route } from '../models/route.model';
import { Days } from '../models/route.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';


@Component({
  selector: 'app-route-browser',
  templateUrl: './route-browser.component.html',
  styleUrls: ['./route-browser.component.scss']
})
@Injectable()
export class RouteBrowserComponent implements OnInit {

  subscribedRoutesIds:Array<string>;
  routes:Array<Route>;
  routesStatus:Array<object>;
  searchForm:FormGroup;
  loaded:boolean;
  days:Array<string>;
  daysShort:Array<string>;

  pager: any = {};  // pager object
  pagedItems: Array<Route>; // paged items

  constructor(private ttw_apiService:ApiService,
              private ttw_userService:UserService,
              private ttw_pagination:Pagination,
              private fb:FormBuilder,
              private _sanitizer: DomSanitizer
  ) {
    this.routes = [];
    this.routesStatus = [];
    this.subscribedRoutesIds = [];
    this.days = [ 'Monday', 'Tueseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    this.daysShort = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.loaded = false;

    this.ttw_apiService
      .getSubscribedRoutesIds()
      .then(
        function(routes){
          console.log('subscribed', routes);
          this.subscribedRoutesIds = routes;
          this.setPage(1);
        }.bind(this)
      )
      .catch( err => console.log(err));
  }

  ngOnInit() {
    this.loaded = true;
    this.buildForm();
  }

  //=======================
  //      API SERVICE
  //=======================

  setPage(page: number) { //pagination
    this.pager = this.ttw_pagination.getPager(this.routes.length, page); // get pager object from service
    this.pagedItems = this.routes.slice(this.pager.startIndex, this.pager.endIndex + 1); // get current page of items
    console.log('pagedItems:', this.pagedItems);

    if (page < 1 || page > this.pager.totalPages) { return; }
  }

  isRoutePendingRequest(route:Route):Promise<boolean>{
    return this.ttw_apiService.areUnsolvedRequests(route._id);
  }

  sendRequest(route:Route){
    console.log(route._id, route['_creator']);
    this.ttw_apiService
      .addRequest(route['_creator'], route._id)
      .then( res => {
        if(res['success'] === true){
          let index = this.routes.indexOf(route);
          this.routesStatus[index]['isPending'] = true;
        }
        else console.log('failure');
      })
  }

  findRoutes(obj:object){
    this.routes = [];
    this.loaded = false;
    this.ttw_apiService
       .findRoutes(obj)
       .then(routes => routes.forEach( route => this.routes.push(<Route>route) ))
       .then( () => {
          let pendingArray = [];
          this.routesStatus = [];
          return Promise.all(
            this.routes.map(async (route) => {
              const isPending = await this.isRoutePendingRequest(route);
              const isSubscribed = this.isRouteSubscribed(route);
              const routeStatus = {routeId: route._id, isPending: isPending, isSubscribed: isSubscribed};

              this.routesStatus.push(routeStatus);
            })
          )
       })
       .then( () => {
         this.loaded = true;
         this.setPage(1);
         console.log('routeStatus', this.routesStatus);
       })
  }


  //=======================
  //   FORM CONTROLLING & BUILDING
  //=======================

  buildForm():void{
    this.searchForm = this.fb.group({
      'startStreet': ['', [
        ]
      ],
      'endStreet': ['', [
        ]
      ],
      'startTime': ['', [
        ]
      ],
      'days': this.fb.array(
        this.putDays(),
        ),
    });

    this.searchForm.valueChanges
        .debounceTime(500)
        .subscribe(
          data => {
            this.onValueChanged(data);
          }
        );
  }

  onSubmit(){
    if(this.searchForm.valid){
    };
  }

  putDays():Array<any>{
    let daysArray = [];
    for(let i=0; i<this.days.length; i++){
      daysArray.push( this.fb.group({day: [false, ]}) );
    }
    return daysArray;
  }

  onValueChanged(data?: any){
    if(!this.searchForm) return;
    const form = this.searchForm;
    let obj ={};
    console.log('VALUE CHANGED');

    Object.keys(form.controls).forEach(key => {
      obj[key]=form.get(key).value;
    });
    console.log(obj);
    this.findRoutes(obj);
  }

  //=======================
  //    LOCAL FUNCTIONS
  //=======================

  isRouteSubscribed(route:Route):boolean{
    let result = this.subscribedRoutesIds.filter( id => id === route._id);
    return result.length === 0 ? false : true;
  }


  getAsArray(days:Days):Array<object>{
    let daysArray:Array<object> = [];
    Object.keys(days).forEach( (key, i) => {
      daysArray.push({name: key, value: days[key]})
    })
    return daysArray;
  }

  //=======================
  //      SUGGESTIONS
  //=======================

  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }

  observableSource = (keyword: any): Observable<any[]> => {
    return this.ttw_apiService.getFiveStreetsLike(keyword);
  }


}
