import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Rx from 'rxjs';

import { Observable } from 'rxjs/Observable';
import { WebSocketSubject } from 'rxjs/webSocket';

// import { DataService } from '../services/data.service';

export class Message {
  constructor(
      public sender: string,
      public content: string,
      public isBroadcast = false,
  ) { }
}

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css']
})
export class WebsocketComponent implements OnInit, OnDestroy {

  stockQuote: number;
  sub: Rx.Subscription;

  public serverMessages = new Array<Message>();

  public clientMessage = '';
  public isBroadcast = false;
  public sender = '';

  private socket$: WebSocketSubject<Message>;

  constructor(
    // private dataService: DataService
  ) { }

  ngOnInit() {
    // this.sub = this.dataService.getQuotes()
    //   .subscribe(quote => {
    //     this.stockQuote = quote;
    //   });    

    this.socket$ = WebSocketSubject.create('ws://localhost:8999');

    this.socket$
        .subscribe(
        (message) => {
          console.log(message);
          this.serverMessages.push(message);
        },
        (err) => console.error(err),
        () => console.warn('Completed!')
        );
  }

  ngOnDestroy(){
    // this.sub.unsubscribe();
  }

  public send(): void {
    const message = new Message(this.sender, this.clientMessage, this.isBroadcast);

    this.serverMessages.push(message);
    this.socket$.next(<any>JSON.stringify(message));
    this.clientMessage = '';
  }

}
