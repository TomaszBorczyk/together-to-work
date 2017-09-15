import { Injectable, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  changePassFormVisible:boolean;
  changePassForm:FormGroup;

  constructor(private fb:FormBuilder,
              private ttw_apiService:ApiService,
              private ttw_userService:UserService,
  ) {
    this.changePassFormVisible = false;
  }

  ngOnInit() {
    this.buildForm();
  }


  //=====================
  //FORM CONTROLLING
  //=====================

  showChangePasswordForm(){
    console.log("change password");
    this.changePassFormVisible = true;
  }

  cancelChangePassword(){
    this.changePassFormVisible = false;
  }

  onSubmit(){
    if(this.changePassForm.valid){
      let password:string = this.changePassForm.get('password').value;
      let newPassword:string = this.changePassForm.get('new_password').value;
      let username:string = this.ttw_userService.getUsername();

      this.ttw_apiService
        .changePassword(username, password, password)
        .then(success => console.log('password changed succesfully'))
        .catch(err => console.log(err));
    }
  }


  buildForm():void{
    this.changePassForm = this.fb.group({
      'password': ['', [
          Validators.required,
        ]
      ],
      'new_password':['',[
        Validators.required,
        Validators.minLength(5)
        ]
      ],

      're_new_password':['',[
        Validators.required,
        ]
      ]
    }, {validator: this.areEqual});

    this.changePassForm.valueChanges
        .subscribe(
          data => this.onValueChanged(data)
        );

    this.onValueChanged();
  }



  onValueChanged(data?: any){
    if(!this.changePassForm) return;
    const form = this.changePassForm;

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
    let passwordValue = ac.get('new_password').value;
    let rePasswordValue = ac.get('re_new_password').value;

    if(passwordValue!=rePasswordValue){
      ac.get('re_new_password').setErrors( {notequal: true});
    } else{
      return null;
    }
  }

  formErrors = {
    'password': '',
    'new_password': '',
    're_new_password': ''
  }

  validationMessages = {
    'password': {
      'required': 'Password is required',
    },

    'new_password': {
      'required': 'New password is required',
      'notequal': 'Does not mach',
      'minlength': 'Password must be at least 5 characters long'
    },

    're_new_password': {
      'required': 'Password confirmation is required',
      'notequal': 'Does not mach'
    }
  }


}
