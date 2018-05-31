import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatFormField } from '@angular/material';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.css']
})
export class MatTableComponent implements OnInit, AfterViewInit {

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  columnNames = [];
  // dataSource = ELEMENT_DATA;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource([]);

  @ViewChild('firstPaginator') firstPaginator: MatPaginator;
  @ViewChild('firstSort') firstSort: MatSort;
  @ViewChild('secondPaginator') secondPaginator: MatPaginator;
  @ViewChild('secondSort') secondSort: MatSort;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.firstPaginator;
    this.dataSource.sort = this.firstSort;

    // mat-table 의 ngFor 에 연결되어 있기 때문에 AfterViewInit 에서 실행시 오류 난다!
    // ==> OnInit 단계에서 이미 생성 되어 있어야 함
    // this.columnNames = ELEMENT_META.map(ele => ele.name);
  }

  ngAfterViewInit(){
    // this.columnNames = ELEMENT_META.map(ele => ele.name);
    // this.dataSource2 = new MatTableDataSource(ELEMENT_DATA);
  }

  showTable2(){
    console.log("click Table2");

    this.columnNames = ELEMENT_META.map(ele => ele.name);
    this.dataSource2 = new MatTableDataSource(ELEMENT_DATA);    
    this.dataSource2.paginator = this.secondPaginator;
    this.dataSource2.sort = this.secondSort;    
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }  
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_META: any[] = [
  { name: 'position', type: 'number' }, 
  { name: 'name', type: 'string' }, 
  { name: 'weight', type: 'number' }, 
  { name: 'symbol', type: 'string' }
];

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
