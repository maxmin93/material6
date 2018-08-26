import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatTableComponent } from './mat-table/mat-table.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { CytoGraphComponent } from './cyto-graph/cyto-graph.component';
import { RxjsTutorialsComponent } from './rxjs-tutorials/rxjs-tutorials.component';
import { CytoStreamComponent } from './cyto-stream/cyto-stream.component';
import { CytoTutorialsComponent } from './cyto-tutorials/cyto-tutorials.component';

import { D3TutorialComponent } from './d3-tutorial/d3-tutorial.component';
import { D3GraphComponent } from './d3-graph/d3-graph.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';

import { D3Graph01Component } from './d3-graph01/d3-graph01.component';
import { CytoAnimateComponent } from './cyto-animate/cyto-animate.component';

const routes: Routes = [
  { path: 'mat-table', component: MatTableComponent },
  { path: 'ngx-table', component: NgxTableComponent },
  { path: 'cyto-graph', component: CytoGraphComponent },
  { path: 'cy-tutorials', component: CytoTutorialsComponent },
  { path: 'socket', component: WebsocketComponent },
  { path: 'rxjs', component: RxjsTutorialsComponent },
  { path: 'stream', component: CytoStreamComponent },
  { path: 'cy-animate', component: CytoAnimateComponent },

  { path: 'd3-tutorial', component: D3TutorialComponent },
  { path: 'd3-graph', component: D3GraphComponent },
  { path: 'd3-chart', component: D3ChartComponent },

  { path: 'd3-graph01', component: D3Graph01Component },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
