import { Component, OnInit } from '@angular/core';

import { D3Node } from './components/d3node/d3node.component';
import { D3Edge } from './components/d3edge/d3edge.component';

import { D3CONFIG } from '../app.config';

@Component({
  selector: 'app-d3-graph01',
  templateUrl: './d3-graph01.component.html',
  styleUrls: ['./d3-graph01.component.css']
})
export class D3Graph01Component implements OnInit {

  nodes: D3Node[] = [];
  edges: D3Edge[] = [];

  constructor() {
    const N = D3CONFIG.N,
          getIndex = number => number - 1;

    /** constructing the nodes array */
    for (let i = 1; i <= N; i++) {
      this.nodes.push(new D3Node(i));
    }

    for (let i = 1; i <= N; i++) {
      for (let m = 2; i * m <= N; m++) {
        /** increasing connections toll on connecting nodes */
        this.nodes[getIndex(i)].linkCount++;
        this.nodes[getIndex(i * m)].linkCount++;

        /** connecting the nodes before starting the simulation */
        this.edges.push(new D3Edge(i, i * m));
      }
    }
  }

  ngOnInit() {
  }

}
