import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatTableComponent } from './mat-table/mat-table.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { CytoGraphComponent } from './cyto-graph/cyto-graph.component';

const routes: Routes = [
  { path: 'mat-table', component: MatTableComponent },
  { path: 'ngx-table', component: NgxTableComponent },
  { path: 'cyto-graph', component: CytoGraphComponent },
  { path: 'socket', component: WebsocketComponent }
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
