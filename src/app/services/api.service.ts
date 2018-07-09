import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { of, from, Observable, Subject, Subscription } from 'rxjs';
import { tap, concatAll, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private createAuthorizationHeader():HttpHeaders {
    let ssid:string = '1234567890'; // localStorage.getItem('agens-ssid');
    return new HttpHeaders({'Content-Type': 'application/json', 'Authorization':ssid});
  }

  public getPeriodics(): Observable<PeriodicElement[]> {
    let elements : PeriodicElement[] = ELEMENT_DATA;
    return Observable.create(of(elements)).delay(500);
  }  

  getHttpData2(): Observable<any>{
    const url = `http://localhost:8080/api/customer`;
    return this.http.get<any>(url, {headers: this.createAuthorizationHeader()});
  }

  getHttpData(): Observable<any>{
    const url = `http://localhost:8080/api/web01/`;
    return this.http.get<any>(url, {headers: this.createAuthorizationHeader()});
  }

}

/////////////////////////////////////////////////////////////

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
