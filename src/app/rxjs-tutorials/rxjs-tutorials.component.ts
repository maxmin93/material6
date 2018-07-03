import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { from, of, range, fromEvent, timer, interval, empty, iif } from 'rxjs';
import { merge, zip } from 'rxjs';
import { tap, map, filter, switchMap, flatMap, retryWhen, take } from 'rxjs/operators';
import { concat, concatAll, combineAll, defaultIfEmpty, mergeMap, groupBy, toArray } from 'rxjs/operators';

import { GraphDataService } from '../services/graph-data.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-rxjs-tutorials',
  templateUrl: './rxjs-tutorials.component.html',
  styleUrls: ['./rxjs-tutorials.component.css']
})
export class RxjsTutorialsComponent implements AfterViewInit, OnDestroy {

  constructor( private graphService: GraphDataService ) { }

  ngOnDestroy(){
  }

  ngAfterViewInit() {
    // this.tutorial01();
    // this.tutorial02();
    // this.tutorial03();
    // this.tutorial04();
    // this.tutorial05();
    // this.tutorial06();
    this.lodash01();
  }

  lodash01(){
    let object = { 'a': { 'b': 2 } };
    let other = _.create({ 'a': _.create({ 'b': 2 }) });
    let another = _.clone(other);

    console.log( object, _.has(object, 'a') );  // => true
    console.log( object, _.has(object, 'a.b') );   // => true
    console.log( object, _.has(object, ['a', 'b']) );   // => true
    console.log( other, _.has(other, 'a') );    // => false
    // console.log( other.a, _.values(other) );
    console.log( another.a, _.values(another) );

    let users = [
      { 'user': 'barney',  'age': 36, 'active': true, 'data': {'labels':['product']} },
      { 'user': 'fred',    'age': 40, 'active': false, 'data': {'labels':['customer']} },
      { 'user': 'pebbles', 'age': 1,  'active': true, 'data': {'labels':['order','product']} }
    ];    
    console.log( _.find(users, { 'data': {'labels':['product'] }}) );
  }

  graphJson02(){
    let source$ = this.graphService.getData().pipe(
      map(x => x.elements),
      tap(x => console.log( `nodes exists: ${x.hasOwnProperty('nodes')}, edges exists: ${x.hasOwnProperty('edges')}`))
    );
    let nodes$ = source$.pipe( map(x => x.nodes), concatAll(), map(x => x['data']), take(5) );
    let edges$ = source$.pipe( map(x => x.edges), concatAll(), map(x => x['data']), take(5) );

    // nodes$.subscribe(x => console.log( 'nodes:', x )).unsubscribe();
    // edges$.subscribe(x => console.log( 'edges:', x )).unsubscribe();
    // let elements$ = Observable.create().pipe( merge( nodes$, edges$ ), concatAll() );

    let elements$ = zip( nodes$, edges$ ).pipe( concatAll() );
    elements$.subscribe(x => console.log( x )).unsubscribe();
  }

  graphJson01(){
    /*
    let source = this.graphService.getData().pipe(
      map(x => x.elements),
      map(x => x.nodes),
      tap(x => console.log( `nodes size = ${x.length}` )),
      concatAll(),    // 이거 안하면 undefined 출력됨 <== [[...]] 을 [...] 으로 변환
      map(x => x['data']),
      filter(x => x.labels.includes('product')),
      take(5)
      );
    */
    let source = this.graphService.getData().pipe(
      filter(x => _.has(x, 'elements.nodes')),
      map(x => x.elements.nodes),
      tap(x => console.log( `nodes size = ${x.length}` )),
      concatAll(),    // 이거 안하면 undefined 출력됨 <== [[...]] 을 [...] 으로 변환
      map(x => x['data']),
      filter(x => x.labels.includes('product')),
      take(5)
      );
  
    source.subscribe(x => console.log( x )).unsubscribe();
  }

  tutorial01(){
    range(1, 200)
    .pipe(filter(x => x % 2 === 1), map(x => x + x))
    .subscribe(x => console.log(x));    
  }

  tutorial02(){
    const myArray = [1, 2, 3];

    // NORMAL
    // console.log('Normal');
    // const myNewArray = myArray.map(o => `${o.toString()} + !!!`);
    // myNewArray.forEach(o => console.log(o));
    
    // RXJS
    console.log('Hello, RxJS');
    const myObservable = from(myArray).pipe( map(o => `${o.toString()} + !!!`) );    
    myObservable.subscribe(o => console.log(o));
  }

  tutorial03(){
    // NORMAL
    // const myPromise = new Promise((resolve) => {
    //   setTimeout(() => resolve('Normal'), 3000);
    // });
    // myPromise.then(o => console.log(o));

    // RXJS
    const myObservable = Observable.create((observer) => {
      setTimeout(() => {
        observer.next('RxJS after 3 secs');
        observer.complete();
      }, 3000);
    });
    myObservable.subscribe(o => console.log(o));    
  }

  tutorial04(){
    const mySubject = new BehaviorSubject(0);
    let subscriptionA = mySubject.subscribe({
      next: o => console.log(`observerA: ${o}`),
    });
    mySubject.next(1);
    mySubject.next(2);
    subscriptionA.unsubscribe();
    let subscriptionB = mySubject.subscribe({
      next: o => console.log(`observerB: ${o}`),
    });
    mySubject.next(3);
    subscriptionB.unsubscribe();
  }
/*
  tutorial05(){
    function identity(x) { return x*2; }

    const myObservable = Observable.create(o => {
          console.log('subscribing');
          o.onError(new Error('always fails'));
      }).pipe( 
        retryWhen( attempts => range(1, 3).pipe(
          zip(attempts, identity),    // rxjs 6 에서는 오류!
          flatMap(i => {
            console.log('delay retry by ' + i + ' second(s)');
            return timer(i * 500);
          }) 
        ))
      );
    
    myObservable.subscribe();
  }
*/
  tutorial06(){
    const source = interval(500).pipe( take(2) );
    const example = source.pipe(
      map(val => interval(400).pipe(
        map(i => `Result(${val}): ${i}`), take(4)
      ))
    );
    const combined = example.pipe( combineAll() );
    const subscribe = combined.subscribe(val => console.log(val));
    // subscribe.unsubscribe();
  }
}
