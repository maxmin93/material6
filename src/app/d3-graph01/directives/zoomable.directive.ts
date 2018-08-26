import { Directive, Input, ElementRef, OnInit } from '@angular/core';

import { D3GraphService } from '../services/d3-graph-service';

@Directive({
    selector: '[zoomableOf]'
})
export class ZoomableDirective implements OnInit {
    @Input('zoomableOf') zoomableOf: ElementRef;

    constructor(
      private d3Service: D3GraphService, 
      private _element: ElementRef
    ) {}

    ngOnInit() {
      this.d3Service.applyZoomableBehaviour(this.zoomableOf, this._element.nativeElement);
    }
}
