import { Injectable, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { StorageService } from  '../services/local-storage.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  loginFailed:boolean;

  constructor(
      private ttw_apiService:ApiService,
      private localStorage:LocalStorageService,
      private ttw_storageService:StorageService,
      private fb:FormBuilder
    ) {
      this.loginFailed = false;
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
    this.loginForm = this.fb.group({
      // 'username': [this.user.username,[
      'username': ['',[
          Validators.required,
        ]
      ],
      // 'password': [this.user.password, [
      'password': ['', [
          Validators.required,
        ]
      ]
    });

    this.loginForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );

    this.onValueChanged();
  }

  onSubmit(){
    if(this.loginForm.valid){
      let username:string = this.loginForm.get('username').value;
      let password:string = this.loginForm.get('password').value;

      this.ttw_apiService
          .login(username, password)
          .catch( err => {
            this.loginFailed = true;
          });
    }
  }

  onValueChanged(data?: any){
    if(!this.loginForm) return;
    const form = this.loginForm;
    this.loginFailed = false;

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
    'username': '',
    'password': ''
  }

  validationMessages = {
    'username': {
      'required': 'Username is required',
    },

    'password': {
      'required': 'Password is required',
    }

  }

}
