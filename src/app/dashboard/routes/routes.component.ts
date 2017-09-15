import { Injectable, Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Car } from '../../models/car.model';
import { Route, Days } from '../../models/route.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';

import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
@Injectable()
export class RoutesComponent implements OnInit {

  routes:Array<Route>;
  routeForm:FormGroup;
  cars:Array<Car>;
  days:Array<string>;

  constructor(
    private fb:FormBuilder,
    private ttw_apiService:ApiService,
    private _sanitizer: DomSanitizer
  ) {
      this.routes = [];
      this.cars = [];
      this.days = [ 'Monday', 'Tueseday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      this.loadCars();
      this.getRoutesDB();
   }


  ngOnInit() {
    this.buildForm();
  }

  //=====================
  //API SERIVICE FUNCTIONS
  //=====================

  loadCars(){
    return this.ttw_apiService
      .getCars()
      .then(cars => cars.map(car => this.cars.push(<Car>car)) )
  }

  //ROUTES
  getRoutesDB(){
    this.ttw_apiService
      .getRoutes()
      .then(routes => routes.forEach( route => this.routes.push(<Route>route)))
      .then( () => console.log(this.routes))
  }

  saveRoute(newRoute:Route){
    this.ttw_apiService
      .addRoute(newRoute)
      .then( route => this.routes.push(route))
      .catch( err => console.log(err))
  }

  removeRoute(route:Route){
    let index = this.routes.indexOf(route);
    let deleteId = route._id;

    this.ttw_apiService
      .removeRoute(deleteId)
      .then(success => this.routes.splice(index, 1))
      .catch(err => console.log('err',err))
  }


  //=====================
  //LOCAL FUNCTIONS
  //=====================
  addVia():void{
        const control = <FormArray>this.routeForm.controls['viaStreets'];
        const addrCtrl = this.initVia();
        control.push(addrCtrl);
  }

  removeVia(i: number) {
       const control = <FormArray>this.routeForm.controls['viaStreets'];
       control.removeAt(i);
   }

  initVia() {
    return this.fb.group( {name: ['', Validators.required]} );
  }


  putDays():Array<any>{
    let daysArray = [];
    for(let i=0; i<7; i++){
      daysArray.push( this.fb.group({day: [false, ]}) );
    }
    return daysArray;
  }

  getCarById(id:string):Car{
    return this.cars.filter( car => car._id === id)[0];
  }


  getAsArray(days:Days):Array<object>{
    let daysArray:Array<object> = [];
    Object.keys(days).forEach( (key, i) => {
      daysArray.push({name: key, value: days[key]})
    })
    return daysArray;
  }


  //=====================
  //    FORM BUILDING
  //=====================

  buildForm():void{
    this.routeForm = this.fb.group({
      'startStreet': ['Grunwaldzka',[
          Validators.required,
        ]
      ],
      'endStreet': ['Tenisowa', [
          Validators.required,
        ]
      ],
      'viaStreets': this.fb.array([]),

      'days': this.fb.array(
        this.putDays(),
        this.requireAtLeastOneCheckbox),

      'startTime': ['', [
          Validators.required,
        ]
      ],

      'car': ['', [
          Validators.required,
        ]
      ],
      'isReturning':[false,[
        ]
      ]
    });

    this.routeForm
      .valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  requireAtLeastOneCheckbox(fa:FormArray){
    let valid = false;

    for(let i = 0; i < fa.length; i++){
      if(fa.at(i).value.day == true){
        return null;
      }
    }
    return {requireAtLeastOneCheckbox: {valid: false}};
  }

  onValueChanged(data?: any){
    if(!this.routeForm) return;
    const form = this.routeForm;

    for(const field in this.formErrors){
      this.formErrors[field] = '';
      const control = form.get(field);

      if(control && control.dirty && !control.valid){
        const messages = this.validationMessages[field];
        for(const key in control.errors){
          console.log(field, key, messages[key]);
          this.formErrors[field] += messages[key];
        }
      }
    }
  }


  //errors to display under invalid inputs
  formErrors = {
    'startStreet': '',
    'endStreet': '',
    'startTime': '',
    'car': '',
  }


  validationMessages = {
    'startStreet': {
      'required': 'startStreet is required',
    },

    'endStreet': {
      'required': 'endStreet is required',
    },

    'startTime': {
      'required': 'startTime is required',
    },

    'changePassword': {
      'required': 'Car is required',
    },

    'isReturning': {
    }
  }


  //=====================
  //  FORM CONTROLLING
  //=====================

  onSubmit(){
    if(this.routeForm.valid){
      let newRoute:Route = this.createRouteFromForm();
      this.saveRoute(newRoute);
    }
  }

  createRouteFromForm():Route{
    let carId:string = (<Car>this.routeForm.get('car').value)._id;
    let vias:Array<string>= this.routeForm.get('viaStreets').value;
    let days = new Days();
    let daysRawForm = this.routeForm.get('days').value;

    Object.keys(days).forEach( (key, i) => days[key] = daysRawForm[i].day)

    let newRoute = new Route('',
                              this.routeForm.get('startStreet').value,
                              this.routeForm.get('endStreet').value,
                              this.routeForm.get('startTime').value,
                              this.routeForm.get('isReturning').value,
                              carId,
                              '',
                              vias,
                              days);
    return newRoute;
  }


  //=====================
  // SUGGESTIONS
  //=====================

  autocompleListFormatter = (data: any) : SafeHtml => {
    let html = `<span>${data.name}</span>`;
    return this._sanitizer.bypassSecurityTrustHtml(html);
  }


  observableSource = (keyword: any): Observable<any[]> => {
    console.log('source');
    return this.ttw_apiService.getFiveStreetsLike(keyword);
  }


}
