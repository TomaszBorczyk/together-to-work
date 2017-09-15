import { Car } from  './car.model';
import { Route } from  './route.model';

export class User{

  constructor(
    public username:string,
    public password:string,
    public email?:string,
    public cars?:Array<Car>,
    public routes?:Array<Route>
  ){}
}
