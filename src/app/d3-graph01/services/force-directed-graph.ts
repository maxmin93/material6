import { EventEmitter } from '@angular/core';

import { D3Node } from '../components/d3node/d3node.component';
import { D3Edge } from '../components/d3edge/d3edge.component';

import * as d3 from 'd3';

const FORCES = {
  LINKS: 1 / 50,
  COLLISION: 1,
  CHARGE: -1
}

export class ForceDirectedGraph {
  public ticker: EventEmitter<d3.Simulation<D3Node, D3Edge>> = new EventEmitter();
  public simulation: d3.Simulation<any, any>;

  public nodes: D3Node[] = [];
  public edges: D3Edge[] = [];

  constructor(nodes, edges, options: { width, height }) {
    this.nodes = nodes;
    this.edges = edges;

    this.initSimulation(options);
  }

  connectNodes(source, target) {
    let edge;

    if (!this.nodes[source] || !this.nodes[target]) {
      throw new Error('One of the nodes does not exist');
    }

    edge = new D3Edge(source, target);
    this.simulation.stop();
    this.edges.push(edge);
    this.simulation.alphaTarget(0.3).restart();

    this.initEdges();
  }

  initNodes() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.nodes(this.nodes);
  }

  initEdges() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.force('links',
      d3.forceLink(this.edges)
        .id(d => d['id'])
        .strength(FORCES.LINKS)
    );
  }

  initSimulation(options) {
    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing simulation');
    }

    /** Creating the simulation */
    if (!this.simulation) {
      const ticker = this.ticker;

      this.simulation = d3.forceSimulation()
        .force('charge',
          d3.forceManyBody()
            .strength(d => FORCES.CHARGE * d['r'])
        )
        .force('collide',
          d3.forceCollide()
            .strength(FORCES.COLLISION)
            .radius(d => d['r'] + 5).iterations(2)
        );

      // Connecting the d3 ticker to an angular event emitter
      this.simulation.on('tick', function () {
        ticker.emit(this);
      });

      this.initNodes();
      this.initEdges();
    }

    /** Updating the central force of the simulation */
    this.simulation.force('centers', d3.forceCenter(options.width / 2, options.height / 2));

    /** Restarting the simulation internal timer */
    this.simulation.restart();
  }
}
