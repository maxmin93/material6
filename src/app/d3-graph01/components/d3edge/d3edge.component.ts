import { Component, OnInit, Input } from '@angular/core';

import { D3Node } from '../d3node/d3node.component';

@Component({
  selector: '[d3edge]',
  template: `
  <svg:line
      class="edge"
      [attr.x1]="edge.source.x"
      [attr.y1]="edge.source.y"
      [attr.x2]="edge.target.x"
      [attr.y2]="edge.target.y"
  ></svg:line>
  `,
  styleUrls: ['./d3edge.component.css']
})
export class D3edgeComponent implements OnInit {

  @Input('data') edge: D3Edge;

  constructor() { }

  ngOnInit() {
  }

}

export class D3Edge implements d3.SimulationLinkDatum<D3Node> {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;

  // must - defining enforced implementation properties
  source: D3Node | string | number;
  target: D3Node | string | number;

  constructor(source, target) {
    this.source = source;
    this.target = target;
  }
}

