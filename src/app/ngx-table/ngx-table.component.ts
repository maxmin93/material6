import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

declare var CodeMirror : any;

@Component({
  selector: 'app-ngx-table',
  templateUrl: './ngx-table.component.html',
  styleUrls: ['./ngx-table.component.css']
})
export class NgxTableComponent implements OnInit {

  rows = [];
  editor: any;

  @ViewChild('codeArea') codeArea: ElementRef;

  constructor() {
    this.fetch((data) => {
      this.rows = data;
    });
  }

  ngOnInit(){
    this.editor = new CodeMirror.fromTextArea( this.codeArea.nativeElement, {
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `/assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

}
