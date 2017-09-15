import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { StorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
@Injectable()
export class DashboardComponent implements OnInit {
  newRequests:number;

  constructor(
    private ttw_apiService:ApiService,
    private ttw_storageService:StorageService
  ) {
    this.newRequests = null;
    // this.ttw_storageService.newRoutesCount.subscribe( count => this.newCount = <number>count )
  }

  ngOnInit() {
    // this.ttw_apiService.countResolvedtNotShown()
    //   .then( count => this.ttw_storageService.setRoutesCount(count) )
    //   .catch( err => console.log(err));

    // this.newRequests = this.ttw_storageService.getNewRequestsCount();
    let count = this.ttw_storageService.getNewRequestsCount();
    this.newRequests = count > 0 ? count : null;

    this.ttw_storageService
        .newRequestsCount
        .subscribe( newCount => this.newRequests = newCount as number);
  }

}
