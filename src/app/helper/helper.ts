import { Days } from '../models/route.model';

export class Helper{

  constructor(){};

  getDaysAsArray(days:Days):Array<object>{
    let daysArray:Array<object> = [];
    Object.keys(days).forEach( key => daysArray.push({name: key, value: days[key]}));
    return daysArray;
  }
}
