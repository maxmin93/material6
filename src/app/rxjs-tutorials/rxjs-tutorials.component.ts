import { Component, AfterViewInit } from '@angular/core';

import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { from, of, range, fromEvent, timer, interval, empty  } from 'rxjs';
import { map, filter, switchMap, flatMap, zip, retryWhen, take } from 'rxjs/operators';
import { combineAll } from 'rxjs/operators';

import { GraphDataService } from '../services/graph-data.service';

@Component({
  selector: 'app-rxjs-tutorials',
  templateUrl: './rxjs-tutorials.component.html',
  styleUrls: ['./rxjs-tutorials.component.css']
})
export class RxjsTutorialsComponent implements AfterViewInit {

  constructor( private graphService: GraphDataService ) { }

  ngAfterViewInit() {
    // this.tutorial01();
    // this.tutorial02();
    // this.tutorial03();
    // this.tutorial04();
    // this.tutorial05();
    this.tutorial06();
  }

  readGraphData(){
    this.graphService.getData().pipe(
      filter( data => data.hasOwnProperty('elements') ? data.elements : empty() ),
      map( data => data. )  
    )
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

  tutorial05(){
    function identity(x) { return x*2; }

    const myObservable = Observable.create(o => {
          console.log('subscribing');
          o.onError(new Error('always fails'));
      }).pipe( 
        retryWhen( attempts => range(1, 3).pipe(
          zip(attempts, identity),
          flatMap(i => {
            console.log('delay retry by ' + i + ' second(s)');
            return timer(i * 500);
          }) 
        ))
      );
    
    myObservable.subscribe();
  }

  tutorial06(){
    const source = interval(1000).pipe( take(2) );
    const example = source.pipe(
      map(val => interval(1000).pipe(
        map(i => `Result(${val}): ${i}`), take(5)
      ))
    );
    const combined = example.pipe( combineAll() );
    const subscribe = combined.subscribe(val => console.log(val));
  }
}
