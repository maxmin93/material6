import { Component, OnInit, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import 'rxjs/add/operator/map';

import { DataTable, DataTableTranslations, DataTableResource } from '../data-table';
import { films } from './data-table-demo3-data';

@Component({
  selector: 'app-ang-table',
  templateUrl: './ang-table.component.html',
  styleUrls: ['./ang-table.component.css']
})
export class AngTableComponent implements OnInit {

  dataSource: PeriodicElement[] = [];

  filmColumns: string[] = ['title','year','rating','director'];
  filmResource = new DataTableResource(films);
  films = [];
  filmCount = 0;

  @ViewChild(DataTable) filmsTable;

  constructor() { 
    this.filmResource.count().then(count => this.filmCount = count);    
  }

  ngOnInit() {
    this.dataSource = ELEMENT_DATA;
  }

  reloadFilms(params) {
    this.filmResource.query(params).then(films => this.films = films);
  }

  cellColor(car) {
      return 'rgb(255, 255,' + (155 + Math.floor(100 - ((car.rating - 8.7)/1.3)*100)) + ')';
  };

  openConfirmDeleteLabelDialog($event){
    console.log($event);
  }
  
  // special params:
  translations = <DataTableTranslations>{
      indexColumn: 'Index column',
      expandColumn: 'Expand column',
      selectColumn: 'Select column',
      paginationLimit: 'Max results',
      paginationRange: 'Result range'
  };

}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: '1Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: '1Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: '1Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: '1Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: '1Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: '1Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: '1Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: '1Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: '1Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: '1Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: '2Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 12, name: '2Helium', weight: 4.0026, symbol: 'He'},
  {position: 13, name: '2Lithium', weight: 6.941, symbol: 'Li'},
  {position: 14, name: '2Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 15, name: '2Boron', weight: 10.811, symbol: 'B'},
  {position: 16, name: '2Carbon', weight: 12.0107, symbol: 'C'},
  {position: 17, name: '2Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 18, name: '2Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 19, name: '2Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 20, name: '2Neon', weight: 20.1797, symbol: 'Ne'},
];
