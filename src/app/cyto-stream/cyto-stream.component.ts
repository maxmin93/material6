import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';

import { Observable, Subject, Subscription, concat } from 'rxjs';
import { from, of, range, fromEvent, timer, interval, empty, iif } from 'rxjs';
import { merge, zip, forkJoin } from 'rxjs';
import { tap, map, filter, switchMap, flatMap, retryWhen, take, publishReplay, concatMap } from 'rxjs/operators';
import { concatAll, combineAll, defaultIfEmpty, mergeMap, groupBy, toArray } from 'rxjs/operators';

import { GraphDataService } from '../services/graph-data.service';

import * as _ from 'lodash';

declare var agens : any;

@Component({
  selector: 'app-cyto-stream',
  templateUrl: './cyto-stream.component.html',
  styleUrls: ['./cyto-stream.component.css']
})
export class CytoStreamComponent implements OnInit, OnDestroy {

  // cytoscape 객체 
  private canvas:any = null;

  // private stream$:Subject<any[]> = null;
  private nodesSubscription:Subscription = null;
  private edgesSubscription:Subscription = null;

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('divGraph') divGraph: ElementRef;

  constructor( 
    private graphService: GraphDataService,
    private _ngZone: NgZone,    
  ) { 
    // prepare to call this.function from external javascript
    window['angularComponentRef'] = {
      zone: this._ngZone,
      cyCanvasCallback: () => this.cyCanvasCallback(),
      cyElemCallback: (target) => this.cyElemCallback(target),
      cyNodeCallback: (target) => this.cyNodeCallback(target),
      cyQtipMenuCallback: (target, value) => this.cyQtipMenuCallback(target, value),
      component: this
    };    
  }

  ngOnInit() {
    // Cytoscape 생성
    if( this.canvas === null ) {
      this.canvas = agens.graph.graphFactory(
        this.divGraph.nativeElement, 'single', true
      );
    }
/*    
    this.stream$ = new Subject<any[]>();
    this.nodesSubscription = this.stream$.subscribe({
      next: x=> this.canvas.add( x ),
      complete:() => {
          this.canvas.style(agens.graph.stylelist['dark']).update();
          this.canvas.fit( this.canvas.elements(), 30 );
      }
    });
    this.edgesSubscription = this.stream$.subscribe({
      next: x=> this.canvas.add( x ),
      complete:() => {
          this.canvas.style(agens.graph.stylelist['dark']).update();
          this.canvas.fit( this.canvas.elements(), 30 );
      }
    });
*/    
  }

  ngOnDestroy(){
    window['angularComponentRef'] = undefined;
  }

  cyCanvasCallback(){
  }
  cyElemCallback(target){
    console.log( 'cyElemCallback:', `[${target.id()}]`, target.data('name') );
  }
  cyNodeCallback(target){
  }
  cyQtipMenuCallback(target, value){
  }

  ///////////////////////////////////////////////////////////

  toggleProgress(option:boolean=undefined){
    if( option === undefined ){
      this.progressBar.nativeElement.style.visibility = 
        (this.progressBar.nativeElement.style.visibility == 'visible') ? 'hidden' : 'visible';
    }
    else{
      if( option === true ) this.progressBar.nativeElement.style.visibility = 'visible';
      else this.progressBar.nativeElement.style.visibility = 'hidden';
    }
  }

  ///////////////////////////////////////////////////////////

  clearCanvas(){
    this.canvas.elements().remove();
  }

  loadStreams3(){
    this.clearCanvas();

    let data$ = this.graphService.getStreams3();
    data$.subscribe((g) => {
      if( g.key == 'nodes' ) g.subscribe(x => this.canvas.add(x))
      else if( g.key == 'edges' ) g.subscribe(x => this.canvas.add(x))
      else if( g.key == 'meta' ) 
        g.pipe( filter(x => x['group'] == 'meta'), map(x => x['labels'] ), concatAll() )
        .subscribe(x => console.log( '=> label:', x ))
    },
    err => {},
    () => {
      console.log('loadStreams3 completed!!')
    });
    
  }

  loadStreams2(){
    this.clearCanvas();

    let data$ = this.graphService.getStreams2();

    let nodes$ = data$.pipe( filter(x => x['group'] == 'nodes') ).subscribe(
      x => this.canvas.add(x)
      , console.log
      , () => console.log( '[1] nodes$ completed!')
    );
    let edges$ = data$.pipe( filter(x => x['group'] == 'edges') ).subscribe(
      x => this.canvas.add(x)
      , console.log
      , () => console.log( '[2] edges$ completed!')
    );
    let meta$ = data$.pipe( filter(x => x['group'] == 'meta'), map(x => x['labels'] ), concatAll() ).subscribe(
      x => console.log( '=> label:', x )
      , console.log
      , () => console.log( '[3] meta$ completed!')
    );  
  }

  loadStreams(){
    this.clearCanvas();

    let ready$ = of(()=>{
      console.log( 'ready function' );
      this.toggleProgress(true);
    });

    let meta$ = new Subject(), nodes$ = new Subject(), edges$ = new Subject();

    nodes$.subscribe( x => this.canvas.add(x) );
    edges$.subscribe( x => this.canvas.add(x) );
    meta$.pipe(
      tap(x => console.log( `sql : "${ x['summary']['sql'] }"` )),
      map(x => x['labels'] ), concatAll()
    ).subscribe( x => console.log( 'label:', x ) );
    
    concat( ready$, meta$.asObservable(), nodes$.asObservable(), edges$.asObservable() ).subscribe({
      next: x => {
        if( _.isFunction(x) ) x();
      },
      complete: () => {
        this.canvas.style(agens.graph.stylelist['dark']).update();
        this.canvas.fit( this.canvas.elements(), 30 );
        this.toggleProgress(false);
        console.log( 'completed!!' );
      }
    });

    this.graphService.getStreams( meta$, nodes$, edges$ );
  }

  loadElements(){
    let ready$ = of(()=>{
      console.log( 'ready function' );
      this.toggleProgress(true);
      this.clearCanvas();
    });
    let nodes$ = this.graphService.getStream().pipe(
      filter(x => x.hasOwnProperty('group') && x['group'] == 'nodes' )
    );
    let edges$ = this.graphService.getStream().pipe(
      filter(x => x.hasOwnProperty('group') && x['group'] == 'edges' )
    );

    concat(ready$, nodes$, edges$).subscribe({
      next: x => {
        if( _.isFunction(x) ) x();
        else if( _.isObject(x) ) this.canvas.add(x);
      },
      error: e => { console.log( 'loadElements:', e.meesage); },
      complete: () => {
        this.canvas.style(agens.graph.stylelist['dark']).update();
        this.canvas.fit( this.canvas.elements(), 30 );
        this.toggleProgress(false);
      }
    });
  }

  loadNodes(){
    let nodes$ = this.graphService.getStream().pipe(
      filter(x => x.hasOwnProperty('group') && x['group'] == 'nodes' )
    ).subscribe({
      next: x => {
          this.canvas.add(x);
      },
      complete: () => {
          this.canvas.style(agens.graph.stylelist['dark']).update();
          this.canvas.fit( this.canvas.elements(), 30 );
      }
    });
  }

  loadEdges(){
    let edges$ = this.graphService.getStream().pipe(
      filter(x => x.hasOwnProperty('group') && x['group'] == 'edges' )
    ).subscribe({
      next: x => {
          this.canvas.add(x);
      },
      complete: () => {
          this.canvas.style(agens.graph.stylelist['dark']).update();
          this.canvas.fit( this.canvas.elements(), 30 );
      }
    });
  }

}
