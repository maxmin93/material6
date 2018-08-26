import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { D3Node } from '../components/d3node/d3node.component';
import { ForceDirectedGraph } from '../services/force-directed-graph';
import { D3GraphService } from '../services/d3-graph-service';

@Directive({
    selector: '[draggableNode]'
})
export class DraggableDirective implements OnInit {
    @Input('draggableNode') draggableNode: D3Node;
    @Input('draggableInGraph') draggableInGraph: ForceDirectedGraph;

    constructor(
      private d3Service: D3GraphService, 
      private _element: ElementRef
    ) { }

    ngOnInit() {
      this.d3Service.applyDraggableBehaviour(
        this._element.nativeElement, this.draggableNode, this.draggableInGraph);
    }
}
