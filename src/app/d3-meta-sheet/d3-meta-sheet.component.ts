import { Component, OnInit, Inject } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA} from '@angular/material';

declare var d3 : any;

@Component({
  selector: 'app-d3-meta-sheet',
  templateUrl: './d3-meta-sheet.component.html',
  styleUrls: ['./d3-meta-sheet.component.css']
})
export class D3MetaSheetComponent implements OnInit {

  constructor(
    private bottomSheetRef: MatBottomSheetRef<D3MetaSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {}

  close(): void {
    this.data.strength = 0.5;
    this.bottomSheetRef.dismiss('HELLO');
    event.preventDefault();
  }

  ngOnInit() {
    console.log( 'simulation', this.data.strength );
    console.log( 'simulation', this.data.fn );
    d3.select("input[type=range]")
    .datum(this.data)
    .on("input", function(e){
      console.log( 'inputted: value=', this.value, e );
      e.fn.force("link").strength(+this.value);
      e.fn.alpha(1).restart();
    });
  }

}
