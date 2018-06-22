import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cyto-graph',
  templateUrl: './cyto-graph.component.html',
  styleUrls: ['./cyto-graph.component.css']
})
export class CytoGraphComponent implements OnInit {

  @ViewChild('progressBar') progressBar: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
