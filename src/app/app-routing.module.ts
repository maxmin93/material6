import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatTableComponent } from './mat-table/mat-table.component';

const routes: Routes = [
  { path: 'table', component: MatTableComponent }
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
