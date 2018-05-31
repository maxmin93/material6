import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { takeWhile, share, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private ws_url = 'ws://localhost:40510';
  private socketConfig: WebSocketSubjectConfig<any>;
  public  socketStatus: Rx.Observable<boolean>;
  private reconnection: Rx.Observable<number>;

  private connection$: Rx.Observer<boolean>;
  private socket$ : WebSocketSubject<number>;
  private messanger$ : Rx.Observer<number>;

  constructor(
    private reconnectInterval: number = 5000,  /// pause between connections
    private reconnectAttempts: number = 10     /// number of connection attempts
  ) { 
    /// config for WebSocketSubject
    /// except the url, here is closeObserver and openObserver to update connection status
    this.socketConfig = {
      url: this.ws_url,
      closeObserver: {
        next: (e: CloseEvent) => {
          this.socket$ = null;
          this.connection$.next(false);
        }
      },
      openObserver: {
        next: (e: Event) => {
          console.log('webSocket opened!');
          this.connection$.next(true);
        }
      }
    };

    /// connection status
    this.socketStatus = new Rx.Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe( share(), distinctUntilChanged() );

    /// we follow the connection status and run the reconnect while losing the connection
    this.socketStatus.subscribe((isConnected) => {
      if (!this.reconnection && typeof(isConnected) == "boolean" && !isConnected) {
        this.reconnect();
      }
    });    
  }

  public connect(): void {
    this.socket$ = new WebSocketSubject(this.socketConfig);
    this.socket$.subscribe(
      (data) => {
        console.log(data);
        this.messanger$.next(data);
      },
      (error: Event) => {
        if (!this.socket$) {
          /// in case of an error with a loss of connection, we restore it
          this.reconnect();
        }
      },
      () => console.warn('Completed!')
    );
  }

  /// WebSocket Reconnect handling
  public reconnect(): void {
    this.reconnection = Rx.interval(this.reconnectInterval)
      .pipe( takeWhile((v, index) => {
          return index < this.reconnectAttempts && !this.socket$
        }) 
      );

    this.reconnection.subscribe(
      () => {
        this.connect();
      },
      null,
      () => {
        /// if the reconnection attempts are failed, then we call complete of our Subject and status
        this.reconnection = null;
        if (!this.socket$) {
          this.messanger$.complete();
          this.connection$.complete();
        }
      });
  }  

  ////////////////////////////////////////////////////////////

  public getQuotes() : Rx.Observable<number> {
    return new Rx.Observable<number>(observer => {
      this.messanger$ = observer;
    });
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        let errMessage = error.error.message;
        return Rx.Observable.throw(errMessage);
    }
    return Rx.Observable.throw(error || 'WebSocket server error: '+this.ws_url);
  }
  

}

