import { Injectable, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { StorageService } from  '../services/local-storage.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { User } from '../models/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
@Injectable()
export class RegisterComponent implements OnInit {

  username:string;
  registerForm:FormGroup;
  user:User;

  constructor(
    private ttw_apiService:ApiService,
    private localStorage:LocalStorageService,
    private ttw_storageService:StorageService,
    private fb:FormBuilder
  ) {
    this.user = new User('', '');
  }

  ngOnInit() {
    this.buildForm();
  }

  customLogin(){
      this.ttw_apiService.customLogin();
  }

  getLocalStorageUser():string{
    return JSON.stringify(this.localStorage.get('user'));
  }

  buildForm():void{
  this.registerForm = this.fb.group({
    // 'username': [this.user.username,[
    'username': ['mike',[
        Validators.required,
        Validators.minLength(4)
      ]
    ],
    // 'email': [this.user.email, [
    'email': ['mike@a.com', [
        Validators.required,
        Validators.email,
      ]
    ],
    // 'password': [this.user.password, [
    'password': ['pass123', [
        Validators.required,
        Validators.minLength(5)
      ]
    ],
    'rePassword':['pass123',[
      Validators.required,
      ]
    ]
  }, {validator: this.areEqual});

  this.registerForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );

  this.onValueChanged();
}

onSubmit(){
  if(this.registerForm.valid){
    this.user = new User(
                this.registerForm.get('username').value,
                this.registerForm.get('password').value,
                this.registerForm.get('email').value
                        );
    console.log(this.user);
    this.ttw_apiService.registerUser(this.user);

  }
}

onValueChanged(data?: any){
  if(!this.registerForm) return;
  const form = this.registerForm;

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

areEqual(ac: AbstractControl){
  let passwordValue = ac.get('password').value;
  let rePasswordValue = ac.get('rePassword').value;

  if(passwordValue!=rePasswordValue){
    ac.get('rePassword').setErrors( {notequal: true});
  } else{
    return null;
  }

}

formErrors = {
  'username': '',
  'email': '',
  'password': '',
  'rePassword': '',
}

validationMessages = {
  'username': {
    'required': 'Username is required',
    'minlength': 'Username must be at least 4 characters long'
  },

  'email': {
    'required': 'Email is required',
    'email': 'Please enter correct email'
  },

  'password': {
    'required': 'Password is required',
    'minlength': 'Password must be at least 5 characters long'

  },

  'rePassword': {
    'required': 'Password confirmation is required',
    'notequal': 'Does not mach'
  }
}


}
