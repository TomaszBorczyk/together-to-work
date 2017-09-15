import { Car } from './car.model';

export class Days{
  constructor(
    public mon: boolean = false,
    public tue: boolean = false,
    public wed: boolean = false,
    public thu: boolean = false,
    public fri: boolean = false,
    public sat: boolean = false,
    public sun: boolean = false
  ){}

}

export class Route{

  constructor(
    public _id:string,
    public startStreet:string,
    public endStreet:string,
    public startTime:string,
    public isReturning:boolean,
    public carId:string,
    public returnHour?:string,
    public viaStreets?:Array<any>,
    public days?:Days
  ){}
}
