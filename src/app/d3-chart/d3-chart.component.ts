import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Component({
  selector: 'app-d3-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.css']
})
export class D3ChartComponent implements OnInit {

  title = 'D3 Charts';

  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;

  constructor() {}

  ngOnInit() {
      this.initSvg();
      this.initAxis();
      this.drawAxis();
      this.drawBars();
  }

  private initSvg() {
      this.svg = d3.select('svg');
      this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
      this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
      this.g = this.svg.append('g')
          .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
      this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
      this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
      this.x.domain(STATISTICS.map((d) => d.letter));
      this.y.domain([0, d3Array.max(STATISTICS, (d) => d.frequency)]);
  }

  private drawAxis() {
      this.g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3Axis.axisBottom(this.x));
      this.g.append('g')
          .attr('class', 'axis axis--y')
          .call(d3Axis.axisLeft(this.y).ticks(10, '%'))
          .append('text')
          .attr('class', 'axis-title')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '0.71em')
          .attr('text-anchor', 'end')
          .text('Frequency');
  }

  private drawBars() {
      this.g.selectAll('.bar')
          .data(STATISTICS)
          .enter().append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => this.x(d.letter) )
          .attr('y', (d) => this.y(d.frequency) )
          .attr('width', this.x.bandwidth())
          .attr('height', (d) => this.height - this.y(d.frequency) );
  }  
}

export interface Frequency {
  letter: string;
  frequency: number;
}

export const STATISTICS: Frequency[] = [
  {letter: 'A', frequency: .08167},
  {letter: 'B', frequency: .01492},
  {letter: 'C', frequency: .02782},
  {letter: 'D', frequency: .04253},
  {letter: 'E', frequency: .12702},
  {letter: 'F', frequency: .02288},
  {letter: 'G', frequency: .02015},
  {letter: 'H', frequency: .06094},
  {letter: 'I', frequency: .06966},
  {letter: 'J', frequency: .00153},
  {letter: 'K', frequency: .00772},
  {letter: 'L', frequency: .04025},
  {letter: 'M', frequency: .02406},
  {letter: 'N', frequency: .06749},
  {letter: 'O', frequency: .07507},
  {letter: 'P', frequency: .01929},
  {letter: 'Q', frequency: .00095},
  {letter: 'R', frequency: .05987},
  {letter: 'S', frequency: .06327},
  {letter: 'T', frequency: .09056},
  {letter: 'U', frequency: .02758},
  {letter: 'V', frequency: .00978},
  {letter: 'W', frequency: .02360},
  {letter: 'X', frequency: .00150},
  {letter: 'Y', frequency: .01974},
  {letter: 'Z', frequency: .00074}
];

