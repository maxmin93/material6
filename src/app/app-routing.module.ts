import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatTableComponent } from './mat-table/mat-table.component';
import { AngTableComponent } from './ang-table/ang-table.component';
import { WebsocketComponent } from './websocket/websocket.component';

const routes: Routes = [
  { path: 'mat-table', component: MatTableComponent },
  { path: 'ang-table', component: AngTableComponent },
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
