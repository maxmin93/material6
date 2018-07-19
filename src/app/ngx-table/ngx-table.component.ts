import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { concatAll } from 'rxjs/operators';

import { QueryStateComponent, StateType, IResponseDto } from './components/query-state.component';

declare var CodeMirror : any;

@Component({
  selector: 'app-ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.css']
})
export class NgxTableComponent implements OnInit, AfterViewInit {

  private subscription: Subscription;
  private sql: string = `-- NOTE: this is a sample query about NORTHWIND (sample db) 
match path=(cust:customer)-[:PURCHASED]->(r:"order")-[o:ORDERS]->(p:product) 
return path, r, id(cust), o.quantity, label(p), properties(p), (('{"a":1, "b":null}'::jsonb) -> 'b') as TEST 
limit 100;
`;

  companies:any[] = [];
  rows = [];
  editor: any;

  @ViewChild('codeArea') codeArea: ElementRef;
  @ViewChild('queryState') queryState: QueryStateComponent;

  constructor(
    private _http: HttpClient
  ) {
  }

  ngOnInit(){
    this.editor = new CodeMirror.fromTextArea( this.codeArea.nativeElement, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true
    });
    this.editor.setSize('100%', '120px');
    this.editor.setValue(this.sql);
  }
  onDestory(){
    if( this.subscription ) this.subscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.httpLoad();
    // this.fetch((data) => {
    //   this.rows = data;
    // });
  }

  /////////////////////////////////////////////////////////

  onStateOverTime($event){
    console.log('onStateOverTime:', $event);
  }

  loadData(){
    this.queryState.setMessage(StateType.SUCCESS, 'loadData()');
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `/assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  httpLoad(){
    const url = `/assets/data/company.json`;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.subscription = this._http.get<any>(url, {headers: headers})
    .pipe( concatAll() )
    .subscribe(
      (x:any) => {
        this.companies.push( x );
      },
      (err) => {
        console.log('httpLoad:', JSON.stringify(err));
      },
      () => {
        this.rows = [...this.companies];
        console.log('httpLoad completed!');
      }
    );
  }
}
