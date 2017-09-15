import { Injectable, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ApiService } from '../../services/api.service';
import { Pagination } from '../../pagination/pagination';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-welcome-dashboard',
  templateUrl: './welcome-dashboard.component.html',
  styleUrls: ['./welcome-dashboard.component.scss']
})

@Injectable()
export class WelcomeDashboardComponent implements OnInit {
  username:string;
  rating:number;
  pager: any = {};  // pager object
  pagedItems: any[]; // paged items
  allItems: any[];
  private user: object;

  constructor(
    private ttw_userService:UserService,
    private ttw_apiService:ApiService,
    private ttw_pagination:Pagination
  ) {
    this.user = {ratings:[]};
    this.allItems = [];
    this.username = ttw_userService.getUsername();
    this.setUpRatings();
  }

  ngOnInit() { }

  setUpRatings(){
    let id = this.ttw_userService.getID();
    this.ttw_apiService.getAvgRating(id).then(rating => this.rating = rating);
    this.ttw_apiService.getUser(id)
      .then(user => this.user = user)
      .then(() =>{
        let ratings = this.user['ratings'];
        this.allItems = ratings.slice(ratings.length-2, ratings.length-1);
        // this.allItems = this.user['ratings'].reverse();
        this.setPage(1);
      });
  }

  setPage(page: number) { //pagination
    this.pager = this.ttw_pagination.getPager(this.allItems.length, page); // get pager object from service
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1); // get current page of items

    if (page < 1 || page > this.pager.totalPages) { return; }
  }
}
