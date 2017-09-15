import { User } from './user.model';
import { Route } from './route.model';

export class RouteRequest{
  constructor(
    public _id:string,
    public passenger_id:string,
    public driver_id:string,
    public route_id:string,
    public is_solved:boolean,
    public is_accepted:boolean,
    public is_shown:boolean,
  ){}
}

export class RouteRequestRes{
  constructor(
    public _id:string,
    public passenger:User,
    public driver:User,
    public route:Route,
    public is_solved:boolean,
    public is_accepted:boolean,
    public is_shown:boolean,
  ){}
}
