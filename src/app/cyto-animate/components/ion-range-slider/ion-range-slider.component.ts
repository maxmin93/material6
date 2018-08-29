import {ElementRef, OnChanges, SimpleChanges, Input, EventEmitter, Output, Component} from "@angular/core";

import * as moment from 'moment';
import 'ion-rangeslider'
import * as jQuery from "jquery";

@Component({
  selector: 'ion-date-slider',
  template: `<button mat-button (click)="doPlay()"><mat-icon>play_arrow</mat-icon>Play</button>
  <button mat-button (click)="doStop()"><mat-icon>stop</mat-icon>Stop</button>
  <div class="range-slider">
    <input type="text" class="js-range-slider" value="" />
  </div>
  `
})

// 코드 참고
// https://github.com/PhilippStein/ng2-ion-range-slider/blob/master/src/ion-range-slider.component.ts

export class IonRangeSliderComponent implements OnChanges {

    // UNIX datetime 변환을 위한 offset : .format('X')
    private inverseOffset:any = 0;

    @Input() private format: string = 'YYYY-MM-DD';
    private mdata: any[] = [moment('2010-01-01').valueOf(), moment('2010-12-31').valueOf()];

    // current value
    private temp_value:any = undefined;
    private prev_value:any = undefined;
    private _from:any = this.mdata[0];
    get current():any { 
        return this.initialized ? jQuery(this.inputElem).data("ionRangeSlider").result.from_value : undefined;
    }
    @Input() set current(val:any){ 
        this._from = +moment(val,this.format).valueOf();
        if( this.initialized )
            jQuery(this.inputElem).data("ionRangeSlider").update( this._from );
    }

    private min:any;
    private max:any;
    private _values:any[] = [];
    get values():any[] { return this._values; }
    @Input() set values(values:any[]){
        if( !values || values.length == 0 ) return;
        // get unique values && sort
        this._values = values.filter((val,idx,self) => {
            return self.indexOf(val) === idx;
        }).sort();
        this.min = moment(this._values[0], this.format).valueOf();
        this.max = moment(this._values[this._values.length-1], this.format).valueOf();
        // convert date string to moment value
        this.mdata = this._values.filter(x => typeof x == 'string').map(x => moment(x, this.format).valueOf());
    }

    @Input() private grid: boolean = true;
    @Input() private disable: any = false;

    @Input('interval') private intervalSec:number = 3000;
    private intervalId:any = undefined;
    private intervalCount:number = 0;

    // @Output() onStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onFinish: EventEmitter<any> = new EventEmitter<any>();
    @Output() onUpdate: EventEmitter<any> = new EventEmitter<any>();

    private _el: ElementRef;
    private inputElem: any;
    private initialized = false;

    constructor(_el: ElementRef) {
        this._el = _el;
    }

    ngOnInit() {
        this.inverseOffset = moment(new Date()).utcOffset() * -1;

        this.inputElem = this._el.nativeElement.getElementsByTagName('input')[0];
        this.initSlider();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.initialized) {
            for (let propName in changes) {
                let update = {};
                update[propName] = changes[propName].currentValue;
                jQuery(this.inputElem).data("ionRangeSlider").update(update);
            }
        }
    }

    update(data) {
        let val = moment(data, this.format).valueOf();
        jQuery(this.inputElem).data("ionRangeSlider").update({ "from": val });
    }

    reset() {
        jQuery(this.inputElem).data("ionRangeSlider").reset()
    }

    destroy() {
        jQuery(this.inputElem).data("ionRangeSlider").destroy()
    }

    private initSlider() {
        let that = this;
        (<any>jQuery(this.inputElem)).ionRangeSlider({
            type: 'single',
            min: that.min,
            max: that.max,
            from: that._from,
            grid: that.grid,
            disable: that.disable,
            values: that.mdata,

            // **NOTE: 값이 제멋대로라 사용 안하는걸로
            // onStart: after ready

            // doing change by ui controller
            onChange: (e) => {
                if( that.temp_value != e.from_value ){
                    that.temp_value = e.from_value;
                    that.onChange.emit({ "value": e.from_value });
                }
            },
            // final change after changes
            onFinish: (e) => {
                that.onFinish.emit({ "prev_value": that.prev_value, "value": e.from_value });
                that.prev_value = e.from_value;
            },
            // change by user set()
            onUpdate: (e) => {
                that.onUpdate.emit({ "prev_value": that.prev_value, "value": e.from_value });
                that.prev_value = e.from_value;
            }
        });
        this.initialized = true;
    }

    doPlay(){
        if( !this._values || this._values.length == 0 || this.mdata.length == 0 ) return;

        this.intervalCount = 0;
        this.intervalId = setInterval(()=>{
            if( this.intervalCount < this.mdata.length ){
                jQuery(this.inputElem).data("ionRangeSlider").update({ "from": this.intervalCount });
            }
            else{
                if( this.intervalId ){
                    clearInterval(this.intervalId);
                    this.intervalId = undefined;
                }
            }
            this.intervalCount += 1;
        }, this.intervalSec);
    }

    doStop(){
        if( this.intervalId ){
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        jQuery(this.inputElem).data("ionRangeSlider").update({ "from": 0 });
    }
}
