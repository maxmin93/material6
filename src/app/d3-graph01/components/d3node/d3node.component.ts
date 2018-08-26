import { Component, OnInit, Input } from '@angular/core';

import { D3CONFIG } from '../../../app.config';

@Component({
  selector: '[d3node]',
  template: `
  <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
    <svg:circle
        class="node"
        [attr.fill]="node.color"
        cx="0"
        cy="0"
        [attr.r]="node.r">
    </svg:circle>
    <svg:text
        class="node-name"
        [attr.font-size]="node.fontSize">
      {{node.id}}
    </svg:text>
  </svg:g>
  `,
  styleUrls: ['./d3node.component.css']
})
export class D3nodeComponent implements OnInit {

  @Input('data') node: D3Node;
  
  constructor() { }

  ngOnInit() {
  }

}

export class D3Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  linkCount: number = 0;

  constructor(id) {
    this.id = id;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / D3CONFIG.N);
  }

  get r() {
    return 50 * this.normal() + 10;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    let index = Math.floor(D3CONFIG.SPECTRUM.length * this.normal());
    return D3CONFIG.SPECTRUM[index];
  }
}