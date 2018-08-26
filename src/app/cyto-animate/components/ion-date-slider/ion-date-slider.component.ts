import {ElementRef, OnChanges, SimpleChanges, Input, EventEmitter, Output, Component} from "@angular/core";

import 'moment';
import 'ion-rangeslider'
import * as jQuery from "jquery";

@Component({
  selector: 'ion-range-slider',
  template: `<input type="text" value="" />`
})

// 코드 참고
// https://github.com/PhilippStein/ng2-ion-range-slider/blob/master/src/ion-range-slider.component.ts
// https://stackoverflow.com/questions/29689507/getting-date-value-from-ion-slider-with-moment-when-user-changes-the-value
// http://ionden.com/a/plugins/ion.rangeslider/demo_advanced.html 
@Component({
  selector: 'app-ion-date-slider',
  templateUrl: './ion-date-slider.component.html',
  styleUrls: ['./ion-date-slider.component.css']
})
export class IonDateSliderComponent implements OnChanges {

  @Input() private min: any;
  @Input() private max: any;
  @Input() private from: any;
  @Input() private to: any;
  @Input() private disable: any;

  @Input() private prettify: Function;

  @Output() onStart: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onChange: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onFinish: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();
  @Output() onUpdate: EventEmitter<IonRangeSliderCallback> = new EventEmitter<IonRangeSliderCallback>();

  private el: ElementRef;
  private inputElem: any;
  private initialized = false;

  private from_percent: number;
  private from_value: number;
  private to_percent: number;
  private to_value: number;

  constructor(el: ElementRef) {
      this.el = el;
  }

  ngOnInit() {
      this.inputElem = this.el.nativeElement.getElementsByTagName('input')[0];
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
      jQuery(this.inputElem).data("ionRangeSlider").update(data);
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
        min: that.min,
        max: that.max,
        from: that.from,
        to: that.to,
        disable: this.toBoolean(that.disable),  
        prettify: that.prettify,

        onStart: function () {
            that.onStart.emit(that.buildCallback());
        },
        onChange: function (a) {
            that.updateInternalValues(a);
            that.onChange.emit(that.buildCallback());
        },
        onFinish: function () {
            that.onFinish.emit(that.buildCallback());
        },
        onUpdate: function () {
            that.onUpdate.emit(that.buildCallback());
        }
    });
    this.initialized = true;
  }

  private toBoolean(value) {
    if(value && typeof value === "string") {
        return value.toLowerCase() != "false";
    } else {
        return value;
    }
  }

  private updateInternalValues(data: IonRangeSliderCallback) {
    this.min = data.min;
    this.max = data.max;
    this.from = data.from;
    this.from_percent = data.from_percent;
    this.from_value = data.from_value;
    this.to = data.to;
    this.to_percent = data.to_percent;
    this.to_value = data.to_value;
  }

  private buildCallback(): IonRangeSliderCallback {
    let callback = new IonRangeSliderCallback();
    callback.min = this.min;
    callback.max = this.max;
    callback.from = this.from;
    callback.from_percent = this.from_percent;
    callback.from_value = this.from_value;
    callback.to = this.to;
    callback.to_percent = this.to_percent;
    callback.to_value = this.to_value;
    return callback;
  }

}

export class IonRangeSliderCallback {
  min: any;               // MIN value
  max: any;               // MAX value
  from: number;           // FROM value (left or single handle)
  from_percent: number;   // FROM value in percents
  from_value: number;     // FROM index in values array (if used)
  to: number;             // TO value (right handle in double type)
  to_percent: number;     // TO value in percents
  to_value: number;       // TO index in values array (if used)
}
