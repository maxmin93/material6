import { Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Observable, timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-query-state',
  template: `
<div class="example-full-width">
  <span>Result : </span>
  <button mat-raised-button color="primary" (click)="toggleTimer()">Timer</button>
  <form>
    <textarea class="example-form message" rows="2" #queryState type="text" readonly 
        [value]="messageText" [style.color]="messageColor">
    </textarea>
  </form>
</div>
<div #progressBar style='visibility:hidden;' class="example-full-width">
  <mat-progress-bar color="accent" mode="indeterminate">Loading...</mat-progress-bar>
</div>
  `,
  styles: [`
  .example-full-width {
    width: 100%;
  }
  .example-form {
    min-width: 150px;
    width: 97%;
    margin: 5px 5px 5px 5px;
  }
  .message {
    border: 1px solid black;
    font-family: 'Nanum Gothic', sans-serif;
    font-size: 18px;
    padding-top: 5px;
    padding-left: 20px;
  }  
  `]
})
export class QueryStateComponent implements OnInit, OnDestroy {

  messageText: string = '';
  messageColor: string = '';        // error: '#ea614a'

  private _dto: IResponseDto;

  @Input() limitTime: number = 30;    // limitTime : sec

  @Output() overTime: EventEmitter<any> = new EventEmitter();

  private elapsedTimeText: string = '';
  private elapsedTimeSubscription: Subscription = undefined;

  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('queryState') queryState: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(){
    if( this.elapsedTimeSubscription ) this.elapsedTimeSubscription.unsubscribe();
  }

  ///////////////////////////////////////////////

  get dto():IResponseDto {
    return this._dto;
  }

  @Input()
  set dto(dto: IResponseDto){
    this._dto = dto;
  }

  ///////////////////////////////////////////////

  setMessage(state:StateType, message:string){
    switch( state ){
      case StateType.SUCCESS: this.messageColor = 'rgb(0, 64, 255)'; break;
      case StateType.FAIL: this.messageColor = 'rgb(255, 64, 0)'; break;
      default: this.messageColor = 'rgb(96,96,96)';
    }
    this.messageText = message;    
  }

  toggleTimer(){
    if( this.elapsedTimeSubscription ){
      this.toggleProgress(false);
      this.stopTimer();
    }
    else {
      this.toggleProgress(true);
      this.startTimer();
    }
  }

  toggleProgress(option:boolean=undefined){
    if( option === undefined ){
      this.progressBar.nativeElement.style.visibility = 
        (this.progressBar.nativeElement.style.visibility == 'visible') ? 'hidden' : 'visible';
    }
    else{
      this.progressBar.nativeElement.style.visibility = option ? 'visible' : 'hidden';
    }
  }

  /////////////////////////////////////////////////////////

  private startTimer(){
    this.elapsedTimeSubscription = timer(0, 1000).subscribe(
      (x:number) => {
        if( x < 60 ) this.elapsedTimeText = `${x} seconds .. (until limit ${this.limitTime} sec)`;
        else this.elapsedTimeText = `${Math.floor(x/60)} minutes ${x%60} seconds .. (until limit ${this.limitTime} sec)`;
        this.setMessage(StateType.PENDING, this.elapsedTimeText);

        if( x >= this.limitTime ){
          this.overTime.emit(x);
          this.stopTimer();
        }
      },
      (err) => {},
      () => {
        // unsubscribe() 시킨다고 complete 가 실행되지 않음
        console.log( 'Timer observer is completed!' );
      }
    );
  }

  private stopTimer(){
    if( this.elapsedTimeSubscription ) this.elapsedTimeSubscription.unsubscribe();
    this.elapsedTimeSubscription = undefined;
  }

}

export interface IResponseDto {
  group: string;

  state: StateType;   // enum Type
  message: string;
  _link?: string;
};

export enum StateType { 
  PENDING='PENDING', SUCCESS='SUCCESS', FAIL='FAIL', KILLED='KILLED', ERROR='ERROR', NONE='NONE' 
};