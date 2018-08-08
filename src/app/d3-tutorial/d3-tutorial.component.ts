import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-d3-tutorial',
  templateUrl: './d3-tutorial.component.html',
  styleUrls: ['./d3-tutorial.component.css']
})
export class D3TutorialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  exam01(){

    const binCount = 10;
    const data = [1, 2, 33, 44, 5, 66, 77, 88, 99, 11, 122, 33];
    const [min, max] = d3.extent(data);
    const x = d3.scaleLinear().domain([min, max]);

    let x_domain: number[] = x.domain();
    let x_sclae = d3.scaleLinear().domain( d3.extent(data) ).nice( binCount );
    console.log('x_domain', x.ticks(binCount), x_domain, x_sclae.domain());

    // Option 1: Tick-based thresholds
    const histogram1 = d3.histogram().domain( [min,max] ).thresholds(x.ticks(binCount));
    const bins1 = histogram1(data);
    console.log("Option 1 bin widths :", bins1);

    // Option 2: Count-based thresholds
    const histogram2 = d3.histogram().domain([min, max]).thresholds(binCount);
    const bins2 = histogram2(data);
    console.log("Option 2 bin widths :", bins2);

    // Answer #1
    let x_input:number[] = x_sclae.domain(); 
    let histogram3 = d3.histogram().domain( d3.extent(x_input) ).thresholds( x.ticks(binCount) );
    let bins3 = histogram3(data);
    console.log("Option 3 bin widths :", d3.extent(x_input), bins3, bins3.values());
    bins3.map( (x,idx) => {
      x.map( y => console.log( `[${idx}] ${y}` ));
    });

    let histogram4 = d3.histogram().domain( d3.extent(data) ).thresholds(binCount);
    let bins4 = histogram4( data );
    console.log("Option 4 bin widths :", bins4 );

  }

  exam02(){
    const data = [11, 22, 33, 44, 55, 66, 77, 88, 99, 111, 122, 133];
    let binCount = 1;

  }
  
  exam03(){

  }
  
  exam04(){

  }
  
  exam05(){

  }
  
}
