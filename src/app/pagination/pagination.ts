import * as _ from 'underscore';
import {Injectable} from "@angular/core";

@Injectable()
export class Pagination {
   constructor() { }

   getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10) { //pagination
       // calculate total pages
       let totalPages = Math.ceil(totalItems / pageSize);
       let startPage: number, endPage: number;
       if (totalPages <= 4) {
           // less than 10 total pages so show all
           startPage = 1;
           endPage = totalPages;
       } else {
           // more than 10 total pages so calculate start and end pages
           if (currentPage <= 2) {
               startPage = 1;
               endPage = 4;
           } else if (currentPage + 2 >= totalPages) {
               startPage = totalPages - 3;
               endPage = totalPages;
           } else {
               startPage = currentPage - 1;
               endPage = currentPage + 2;
           }
       }

       let startIndex = (currentPage - 1) * pageSize;
       let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
       let pages = _.range(startPage, endPage + 1);
       return {
           totalItems: totalItems,
           currentPage: currentPage,
           pageSize: pageSize,
           totalPages: totalPages,
           startPage: startPage,
           endPage: endPage,
           startIndex: startIndex,
           endIndex: endIndex,
           pages: pages
       };
   }

}
