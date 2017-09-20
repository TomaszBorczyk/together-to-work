import { Component, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Car } from '../../models/car.model';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
@Injectable()
export class CarsComponent implements OnInit {

  cars: Array<Car>;
  carForm: FormGroup;
  formErrors = {
    'name': '',
    'color': '',
    'seats': '',
    'description': '',
  };

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
  };

  constructor(
    private ttw_userService: UserService,
    private ttw_apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.cars = [];
    this.loadCars();
  }

  ngOnInit() {
    this.buildForm();
  }


  //=====================
  //API SERIVICE FUNCTIONS
  //=====================

  loadCars() {
    return this.ttw_apiService
     .getCars()
     .then(cars => cars.map(car => this.cars.push(<Car>car)) );
  }

  addCar(newCar: Car) {
    this.ttw_apiService
      .addCar(newCar)
      .then(
        car => {
          if (car !== null) {
            this.cars.push(car);
          }
        }
      );
  }

  removeCar(car: Car) {
    const index = this.cars.indexOf(car);
    const id = car._id;

    this.ttw_apiService
     .removeCar(id)
     .then(
       success => {
         if (success === true) {
           this.cars.splice(index, 1);
         } else {
           console.log('failure');
         }
       }
     );
  }

  //=====================
  //FORM CONTROLLING
  //=====================
  onSubmit() {
    if (this.carForm.valid) {
      const rawFormValue = this.carForm.getRawValue();
      const car = <Car>rawFormValue;
      this.addCar(car);
    }
  }


  buildForm(): void {
    this.carForm = this.fb.group({
      'name': ['Aston Martin DB11', [
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
      'description': ['', [
        ]
      ]
    });

    this.carForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );

    this.onValueChanged();
  }


  onValueChanged(data?: any) {
    if (!this.carForm) {
      return;
    }
    const form = this.carForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          console.log(field, key, messages[key]);
          this.formErrors[field] += messages[key];
        }
      }
    }
  }

}
