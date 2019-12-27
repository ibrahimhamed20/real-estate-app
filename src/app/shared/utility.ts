export const TransNames = {
  
  InPatientReservation: 'InPatient Reservation',
  EmergencyReservation: 'Emergency Reservation',
  NewBorn : 'NewBorn'
}

export class Utility 
{
  static UiActive : string
  static test : string

}

export function customDateJson(obj: any) {
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (obj[property] instanceof Date) {
          let _date =<Date> obj[property]; 
          let _now =new Date(); 
          if (_date.getHours() == 0 && _date.getMinutes() == 0   ) {
            _date.setHours(_now.getHours());
            _date.setMinutes(_now.getMinutes());
          }
          obj[property] = obj[property].toJSON();
        }
        else if (typeof obj[property] == "object") {
          customDateJson(obj[property]);
        }
      }
    } 
}

export function createAuthorizationHeader() {
  // private  _userSessionService : UserSessionService
  let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  let  forDebug =   JSON.parse(sessionStorage.getItem('forDebug')); 
  let WorkFlowPath = Utility.UiActive
  let  link =   JSON.parse(localStorage.getItem('LinkObj')); 
  let linkId 
 if(link){
   linkId = link.code
 }
else
  {
    linkId = 0
  }
let  hostname =   JSON.parse(localStorage.getItem('hostname')); 
  

  let headers = {
    'Content-Type': 'application/json', 'Authorization': 'Basic ' +
    btoa('SecloginId' + '/' + 'currentUser.secLoginId' + ',' + 'BranchId' + '/' + 'currentUser.branchId' + ','+ 'link'+ '/'+ 'linkId' + ','+'WorkFlowPath'+ '/'+ 'WorkFlowPath' + ','+ 'ForDebug'+ '/'+ 'forDebug')
  };
  return headers;
}
// example {appCode:1096 , varPropName: 'PatCode' , varPropVal: 435 }
export interface AppCodeVariableKeys { 
  appCode: number,
  varPropName: string,
  varPropVal: string,
  defaultPropVal?: number,
  excludedCodes?: string;
}


export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function dateToString(value: Date): string {
  if (value)
    return value.getFullYear() + '/' + value.getMonth() + '/' + value.getDate() + ' ' + value.getHours() + ':' + value.getMinutes();
  else return ''
}

export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export  function  isDateString(value:any):boolean{
  return !isNaN( Date.parse(value));
}
export function  dateFromString(dateString:string):Date{
    return   new Date(dateString);  
}

export function dateAsAkey(value: Date): string {
  if (value)
    return  ''+ value.getFullYear() + value.getMonth() +  value.getDate() ;
  else return ''
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


