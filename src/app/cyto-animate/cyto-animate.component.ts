import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { IResultDto, IResponseDto, IGraphDto } from '../models/agens-response-types';
import { IGraph, ILabel, IElement, INode, IEdge, IStyle, IRecord, IColumn, IRow, IEnd } from '../models/agens-data-types';
import { Label, Element, Node, Edge } from '../models/agens-graph-types';
import { IProject } from '../models/agens-manager-types';

import { IonRangeSliderComponent } from './components/ion-range-slider/ion-range-slider.component';

declare var $     : any;
declare var _     : any;
declare var agens : any;

@Component({
  selector: 'app-cyto-animate',
  templateUrl: './cyto-animate.component.html',
  styleUrls: ['./cyto-animate.component.css']
})
export class CytoAnimateComponent implements OnInit, AfterViewInit {

  // cytoscape 객체 
  private cy:any = null;
  selectedElement:any = undefined;

  private graphData: IGraph = undefined;  

  min: number = 0;
  max: number = 100;

  simpleSlider = {name: "Simple Slider", onUpdate: undefined, onFinish: undefined};

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('divGraph') divCanvas: ElementRef;  constructor() { }

  @ViewChild('simpleSliderElement') simpleSliderElement: IonRangeSliderComponent;

  ngOnInit() {
    // Cytoscape 생성 & 초기화
    this.cy = agens.graph.graphFactory(
      this.divCanvas.nativeElement, {
        selectionType: 'single',    // 'single' or 'multiple'
        boxSelectionEnabled: false, // if single then false, else true
        qtipCxtmenu: true,          // whether to use Context menu or not
        hideNodeTitle: true,       // hide nodes' title
        hideEdgeTitle: true,       // hide edges' title
      }
    );
  }

  cyCanvasCallback(){
    this.selectedElement = undefined;
  }   
  cyElemCallback(e:any){
    console.log(`tap ${e.group()}:`, e.id(), e._private );
    this.selectedElement = e;
  }

  ngAfterViewInit(){
    this.cy.on('tap', (e) => { 
      if( e.target === this.cy ) this.cyCanvasCallback();
      else if( e.target.isNode() || e.target.isEdge() ) this.cyElemCallback(e.target);
    });

    this.cy.json({      
      elements: {
        nodes: [
          { data: { id: 'a', prop: {date: '2018-01-01'} }, position: {x: 543.5, y: 38} },
          { data: { id: 'b', prop: {date: '2018-02-01'} }, position: {x: 733.4583, y: 181} },
          { data: { id: 'c', prop: {date: '2018-03-01'} }, position: {x: 549.5, y: 288} },
          { data: { id: 'd', prop: {date: '2018-04-01'} }, position: {x: 704.5, y: 615} },
          { data: { id: 'e', prop: {date: '2018-05-01'} }, position: {x: 570.5416, y: 465} }
        ],

        edges: [
          { data: { id: 'a"e', weight: 1, source: 'a', target: 'e' } },
          { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
          { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
          { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
          { data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
          { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
          { data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
        ]
      },
    });
    setTimeout(() => {      
      console.log( 'cyto-animate initialize..');
      this.cy.resize();
      // refit canvas
      this.cy.fit( this.cy.elements(), 50);
      // refresh style
      this.cy.style(agens.graph.stylelist['dark']).update();
    }, 100);

    $("#example_id").ionRangeSlider();

  }

  updateSlider(slider, event) {
    console.log("Slider updated: " + slider.name);
    slider.onUpdate = event;
  }
  finishSlider(slider, event) {
    console.log("Slider finished: " + slider.name);
    slider.onFinish = event;
  }
  setAdvancedSliderTo(from, to) {
    this.simpleSliderElement.update({from: from, to:to});
  }

  runLayout(){
    this.cy.layout({
      name: 'breadthfirst',
      directed: true,
      roots: '#a',
      padding: 10
    }).run();

    // this.cy.nodes().first().addClass('highlighted');
  }

  sampleAni(){
    console.log( 'sampleAni: animation start');
    let bfs = this.cy.elements().bfs('#a', function(){}, true);

    let i = 0;
    let highlightNextEle = function(){
      if( i < bfs.path.length ){
        bfs.path[i].addClass('highlighted');
    
        i++;
        setTimeout(highlightNextEle, 1000);
      }
    };
    
    // kick off first highlight
    highlightNextEle();
  }
}
