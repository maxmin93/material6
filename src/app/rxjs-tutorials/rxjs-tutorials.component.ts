import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { from, of, range, fromEvent, timer, interval, empty, iif } from 'rxjs';
import { merge, zip, forkJoin, concat } from 'rxjs';
import { tap, map, filter, take } from 'rxjs/operators';
import { concatAll, combineAll, defaultIfEmpty, mergeMap, groupBy, toArray } from 'rxjs/operators';

import { GraphDataService } from '../services/graph-data.service';
import { ApiService } from '../services/api.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-rxjs-tutorials',
  templateUrl: './rxjs-tutorials.component.html',
  styleUrls: ['./rxjs-tutorials.component.css']
})
export class RxjsTutorialsComponent implements AfterViewInit, OnDestroy {

  constructor( private graphService: GraphDataService, private apiService: ApiService ) { }

  ngOnDestroy(){
  }

  ngAfterViewInit() {
    // this.lodash02();
  }

  //////////////////////////////////////////////////////////////

  graphStream01(){
    let customer$:Observable<any> = this.apiService.getHttpData().pipe(
      tap(console.log),
      concatAll(), // tap(x => console.log( x['age'], '=', x['age'] % 10) ), 
      filter(x => (x['age'] % 10) == 0 )
    );
    
    customer$.subscribe({
      next: x => console.log('item:', x)
    });
  }

  graphStream02(){
    let customer$:Observable<any> = this.apiService.getHttpData2().pipe(
      tap(console.log),
      concatAll(), // tap(x => console.log( x['age'], '=', x['age'] % 10) ), 
      filter(x => (x['age'] % 10) == 0 )
    );
    
    customer$.subscribe({
      next: x => console.log('item:', x)
    });
  }

  //////////////////////////////////////////////////////////////

  graphJson06(){
    let schema$ = new Subject<any>(), graph$ = new Subject<any>(), 
        labels$ = new Subject<any>(), nodes$ = new Subject<any>(), edges$ = new Subject<any>();

    schema$.subscribe({
      next: x => console.log('schema$:', x.message)
    });
    graph$.subscribe({
      next: x => console.log('graph$:', x.nodes_size, x.edges_size)
    });
    labels$.subscribe({
      next: x => console.log('labels$:', x.name)
    });
    nodes$.pipe( take(5) ).subscribe({
      next: x => console.log('nodes$:', x.data.id, x.data.name)
    });
    edges$.pipe( take(5) ).subscribe({
      next: x => console.log('edges$:', x.data.id, x.data.name)
    });
    
    concat( schema$.asObservable(), graph$.asObservable(), labels$.asObservable(), nodes$.asObservable(), edges$.asObservable() )
    .subscribe({
      next: x => { if( _.isFunction(x) ) x(); },
      complete: () => console.log('Completed!!')
    });

    let subscription = this.graphService.getHttpStream( schema$, graph$, labels$, nodes$, edges$ );
  }

  graphJson05(){
    let data$ = this.graphService.getHttpData().pipe( concatAll(), filter(x => x.hasOwnProperty('group')) );

    let schema$ = data$.pipe( filter(x => x.group == 'schema') );
    let graph$ = data$.pipe( filter(x => x.group == 'graph') );
    let labels$ = data$.pipe( filter(x => x.group == 'labels') );
    let nodes$ = data$.pipe( filter(x => x.group == 'nodes') );
    let edges$ = data$.pipe( filter(x => x.group == 'edges') );

    // http call => 5 times
    schema$.subscribe({
      next: x => console.log('schema$:', x.message)
    });
    graph$.subscribe({
      next: x => console.log('graph$:', x.nodes_size, x.edges_size)
    });
    labels$.subscribe({
      next: x => console.log('labels$:', x.name)
    });
    nodes$.pipe( take(5) ).subscribe({
      next: x => console.log('nodes$:', x.data.id, x.data.name)
    });
    edges$.pipe( take(5) ).subscribe({
      next: x => console.log('edges$:', x.data.id, x.data.name)
    });
  }

  graphJson04(){

    const log = console.log;

    function makeAllStream(data){
      // log( 'http call ==> Observable<any[]>' );
      // return from(data);
      return from(data).pipe( tap(() => console.log( 'http call ==> Observable<any[]>' )) );
    }

    function makeSubStream($all, predicates){
      return Object.keys(predicates).reduce( (memo, v) => {
          memo[v] = $all.pipe( filter(predicates[v]) );
          return memo;
      },{});
    }

    function processData(data) {
      log('process begin ------------');     
      const $all:Observable<any> = makeAllStream(data);

      let streams = makeSubStream($all, {
        $metaStream: d=>d.type=='meta',
        $vertexStream: d=>d.type=='vertex',
        $edgeStream: d=>d.type=='edge',
        // $vertexNedge: d=>d.type=='edge' || d.type=='vertex'
      });
      log( streams );

      $all.subscribe(item=>log('$all',item));
      streams['$metaStream'].subscribe(item=>log('$metaStream',item));
      streams['$vertexStream'].subscribe(item=>log('$vertexStream',item));
      streams['$edgeStream'].subscribe(item=>log('$edgeStream',item));
      // streams['$vertexNedge'].subscribe(item=>log('$vertexNedge',item));

      log('process end ------------');
    }

    // processData(data);
    processData(mixedData);
  }

  graphJson03(){
    let subject$ = new Subject();
    const graphStream = Observable.create(function(obs) {
      subject$.subscribe(obs);
      return () => {};
    });

    let obsNodes = {
      next: x => {
        console.log( 'Observer for Nodes', x );
        of(x).pipe( 
            tap(x => console.log( `nodes exists: ${_.has(x, 'nodes')}`)),
            map(x => x['nodes']), concatAll(), map(x => x['data']), take(5),
            tap(x => console.log( 'nodes:', x ))
        ).subscribe();
        // <== subscribe() 를 하지 않았기 때문에 나오는 결과도 없다!
      }};
    // graphStream.subscribe( obsNodes );
    subject$.subscribe(obsNodes);
    let obsEdges = {
      next: x => {
        console.log( 'Observer for Edges', x );
        return of(x).pipe( 
            tap(x => console.log( `edges exists: ${_.has(x, 'edges')}`)),
            map(x => x['edges']), concatAll(), map(x => x['data']), take(5),
            tap(x => console.log( 'edges:', x ))
        ).subscribe();
        // <== subscribe() 를 하지 않았기 때문에 나오는 결과도 없다!
      }}
    // graphStream.subscribe( obsEdges );
    subject$.subscribe(obsEdges);

    this.graphService.getData().pipe(
      map(x => x.elements),
      tap(x => console.log( `nodes exists: ${_.has(x, 'nodes')}, edges exists: ${_.has(x,'edges')}`))
    ).subscribe(res => {
      // console.log( `nodes exists: ${_.has(res, 'nodes')}, edges exists: ${_.has(res,'edges')}`, res);
      subject$.next( res );
    });
  }

  graphJson02(){
    let source$ = this.graphService.getData().pipe(
      map(x => x.elements),
      tap(x => console.log( `nodes exists: ${_.has(x, 'nodes')}, edges exists: ${_.has(x,'edges')}`))
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

  //////////////////////////////////////////////////////////////

  lodash02(){
    var users = {
      'user01': { 'name': 'fred',    'age': 40 },
      'user02': { 'name': 'pebbles', 'age': 1  }
    };

    console.log( _.mapValues(users, function(o) { return o.age; }) );
    // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     
    // The `_.property` iteratee shorthand.
    console.log( _.mapValues(users, 'age') );
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

  //////////////////////////////////////////////////////////////

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

  tutorial07(){
    let mockRequest = () => of('[{"id": 1}, {"id": 2}, {"id": 3}]');
    let otherMockRequest = (id) => of(`{"id":${id}, "desc": "description ${id}"}`);

    let fetchItems = () => mockRequest().pipe( 
              map(res => JSON.parse(res)),
              concatAll(),
              mergeMap(item => fetchItem(item))
    );
    let fetchItem = (item) => otherMockRequest(item.id).pipe(
              map(res => JSON.parse(res))
    );

    fetchItems().subscribe(val => console.log(val));
  }

  tutorial08(){
    let persons = [{
        "firstName":"john", "lastName":"public", "locationID":"1", "departmentID":"100"
      }, {
        "firstName":"sam", "lastName":"smith", "locationID":"2", "departmentID":"101"
      }];
   
    let departments = [{
        "departmentID": "100", "name": "development"
      }, {
        "departmentID": "101", "name": "sales"
      }]
   
    let locations = [{
        "locationID": "1", "name": "chicago"
      }, {
        "locationID": "2", "name": "ny"
      }];

    from(persons).pipe(
      mergeMap(person => {
          let department$ = from(departments).pipe(
              filter(department => department.departmentID == person['departmentID'])
          );
          let location$ = from(locations).pipe(
              filter(location => location.locationID == person['locationID'])
          );
          return forkJoin(department$, location$, (department, location) => {
              return {
                  'firstName': person.firstName,
                  'lastName': person.lastName,
                  'location': location.name,
                  'department': department.name,
              };
          });
      }),
      toArray()
     ).subscribe(result => console.log(result));
  }

  tutorial99(){
    const pendingItems = new Subject();
    const failedItems = new Subject();
    const syncedItems = new Subject();
    const maxRetries = 3;
    
    const queue = (item) => {
      let workingItem = item;
      
      if (!workingItem.sync) {
        workingItem = {
          sync: { counter: 0 },
          item,
        };
      }
      
      if (item.sync.counter > 0 && item.sync.counter >= maxRetries) {
        failedItems.next(workingItem);
        return;
      }  
     
      const retryItem = Object.assign({}, item, {
        sync: {
          counter: item.sync.counter + 1,
          lastTry: new Date(),
        },
      });
    
      pendingItems.next(retryItem);
    }
    
    // not working : unknown http
    /*
    pendingItems.subscribe((itemWithMetaData) => {
      api.syncEvent(itemWithMetaData.item)
      .then(result => syncedItems.next(itemWithMetaData))
      .catch((reason) => {
        queue(itemWithMetaData);
      });
    });
    */
    syncedItems.subscribe(x => console.log('successfully synced a mouse event ', x));
    failedItems.subscribe(x => console.error('failed to sync mouse event ', x));    
  }

  tutorial09(){
    let mySubject = new Subject();
    const notificationArrayStream = Observable.create(function(obs) {
      mySubject.subscribe(obs);
      return () => {};
    });
    
    function trigger(something) {
      mySubject.next(something)
    }
    
    notificationArrayStream.subscribe((x) => console.log('a: ' + x));
    notificationArrayStream.subscribe((x) => console.log('b: ' + x));
    
    trigger('TEST');
  }

  tutorial10(){
    // 스트림 시작
    const observable = Observable.create((observer) => {
      observer.next(Math.random());
    });
  
    const subject = new Subject();
      // subscriber 1
    subject.subscribe((data) => {
        console.log(data); // 0.24957144215097515 (random number)
    });
      // subscriber 2
    subject.subscribe((data) => {
        console.log(data); // 0.24957144215097515 (random number)
    });
  
    // 스트림 격발 (트리거)
    observable.subscribe(subject);    
  }
}

const data = [
  {type:'meta', data:{a:1,b:2}},
  {type:'vertex', data:{id:'1', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'2', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'4', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'5', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'6', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'1', to:'2', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'2', to:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'3', to:'4', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'4', to:'5', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'5', to:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'2', to:'6', props:{p1:1, p2:2, p3:3}}},
];

const mixedData = [
  {type:'meta', data:{a:1,b:2}},
  {type:'vertex', data:{id:'1', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'2', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'1', to:'2', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'2', to:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'3', to:'4', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'4', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'5', props:{p1:1, p2:2, p3:3}}},
  {type:'vertex', data:{id:'6', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'4', to:'5', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'5', to:'3', props:{p1:1, p2:2, p3:3}}},
  {type:'edge', data:{from:'2', to:'6', props:{p1:1, p2:2, p3:3}}},
];
