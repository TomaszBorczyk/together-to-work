import { Injectable, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Car } from '../../models/car.model';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
@Injectable()
export class CarsComponent implements OnInit {

  cars:Array<Car>;
  carForm:FormGroup;

  constructor(
    private ttw_userService:UserService,
    private ttw_apiService:ApiService,
    private fb:FormBuilder
  ){
    this.cars=[];
    this.loadCars();
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

  addCar(newCar:Car){
    this.ttw_apiService
      .addCar(newCar)
      .then(
        car =>{
          if(car !== null){
            this.cars.push(car);
          }
        }
      )
  }

  removeCar(car:Car){
    let index = this.cars.indexOf(car);
    let id = car._id;

    this.ttw_apiService
     .removeCar(id)
     .then(
       success => {
         if(success === true){
           console.log('car deleted');
           this.cars.splice(index, 1);
         }
         else{
           console.log('failure');
         }
       }
     )
  }

  //=====================
  //FORM CONTROLLING
  //=====================
  onSubmit(){
    if(this.carForm.valid){
      let rawFormValue = this.carForm.getRawValue();
      let car = <Car>rawFormValue;
      this.addCar(car);
    }
  }


  buildForm():void{
    this.carForm = this.fb.group({
      'name': ['Aston Martin DB11',[
          Validators.required,
        ]
      ],
      'color': ['red', [
          Validators.required,
        ]
      ],
      'seats': [1, [
          Validators.required,
          Validators.min(1),
          Validators.max(10)
        ]
      ],
      'description':['',[
        ]
      ]
    });

    this.carForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );

    this.onValueChanged();
  }


  onValueChanged(data?: any){
    if(!this.carForm) return;
    const form = this.carForm;

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


  formErrors = {
    'name': '',
    'color': '',
    'seats': '',
    'description': '',
  }


  validationMessages = {
    'name': {
      'required': 'Name is required',
    },

    'color': {
      'required': 'Color is required',
    },

    'seats': {
      'required': 'Free seats number is required',
      'min': 'Free seats number must be between 1 and 10',
      'max': 'Free seats number must be between 1 and 10',
    },

    'description': {
    }
  }


}
