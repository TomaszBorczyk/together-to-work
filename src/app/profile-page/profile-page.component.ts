import { Injectable, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { Pagination } from '../pagination/pagination';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})

@Injectable()

export class ProfilePageComponent implements OnInit {
  commentForm: FormGroup;
  username:string;
  comment: string;
  value: number;
  pager: any = {}; // pager object
  pagedItems: any[]; // paged items
  allItems: any[];

  private id: string;
  private user: object;
  private rating: number;
  private values = [, 1, 2, 3, 4, 5];
  private loaded = false;
  private localUserId:string;

  constructor(
    private ttw_apiService: ApiService,
    private ttw_userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ttw_pagination:Pagination
  ) {
    this.localUserId = this.ttw_userService.getID();
    this.user = { ratings:[] };
    this.allItems = [];
    this.setUpRatings();
    this.username = ttw_userService.getUsername();
  }

  setUpRatings(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.ttw_apiService
          .getUser(this.id)
          .then(user => this.user = user)
          .then(() =>{
            this.allItems = this.user['ratings'].reverse();
            this.setPage(1)
            this.loaded = true;
          });

      this.ttw_apiService
          .getAvgRating(this.id)
          .then(rating => this.rating = rating);
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  setPage(page: number) { //pagination
    this.pager = this.ttw_pagination.getPager(this.allItems.length, page); // get pager object from service
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1); // get current page of items
    if (page < 1 || page > this.pager.totalPages) { return; }

  }

  buildForm(): void {
    this.commentForm = this.fb.group( {
      'value': ['', [ Validators.required, ] ],
      'comment': ['Standard comment here.', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(300)
        ]
      ]
    });

    this.commentForm
        .valueChanges
        .subscribe( data => this.onValueChanged(data) );

    this.onValueChanged();
  }

  onSubmit() {
    if (this.commentForm.valid) {
      this.ttw_apiService.addRating(
        this.commentForm.get('value').value,
        this.commentForm.get('comment').value,
        this.id
      ).then(res => {
        let json = res;
        if (json === false) { return false; }
        else {
          json.comment.author = { _id: json.comment.author, username: this.username};
          // json.comment.author.username = this.username;
          console.log('comment', json.comment);
          console.log('username', this.username);
          this.allItems.unshift(json.comment);
          this.commentForm.reset();
          this.ttw_apiService.getAvgRating(this.id).then(rating => this.rating = rating);
          this.setPage(1);
        }
      });
    }
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) return;
    const form = this.commentForm;
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

  formErrors = {
    'value': '',
    'comment': '',
  }

  validationMessages = {
    'value': {
      'required': 'Value is required.',
    },

    'comment': {
      'required': 'Comment is required.',
      'minlength': 'Comment must be at least 10 characters long.',
      'maxlength': 'Comment too long (max 300 characters).'
    },

  }
}
