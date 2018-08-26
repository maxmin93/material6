import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';

import { GestureConfig,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { RouterModule } from '@angular/router';

// import { DataService } from './services/data.service';

import { MatTableComponent } from './mat-table/mat-table.component';
import { WebsocketComponent } from './websocket/websocket.component';
import { NgxTableComponent } from './ngx-table/ngx-table.component';
import { CytoGraphComponent } from './cyto-graph/cyto-graph.component';
import { RxjsTutorialsComponent } from './rxjs-tutorials/rxjs-tutorials.component';
import { CytoStreamComponent } from './cyto-stream/cyto-stream.component';

import { QueryStateComponent } from './ngx-table/components/query-state.component';
import { CytoTutorialsComponent } from './cyto-tutorials/cyto-tutorials.component';
import { D3TutorialComponent } from './d3-tutorial/d3-tutorial.component';
import { D3GraphComponent } from './d3-graph/d3-graph.component';
import { D3ChartComponent } from './d3-chart/d3-chart.component';
import { D3MetaSheetComponent } from './d3-meta-sheet/d3-meta-sheet.component';

import { D3Graph01Component } from './d3-graph01/d3-graph01.component';
import { D3graphComponent } from './d3-graph01/components/d3graph/d3graph.component';
import { D3nodeComponent } from './d3-graph01/components/d3node/d3node.component';
import { D3edgeComponent } from './d3-graph01/components/d3edge/d3edge.component';
import { D3GraphService } from './d3-graph01/services/d3-graph-service';
import { DraggableDirective } from './d3-graph01/directives/draggable.directive';
import { ZoomableDirective } from './d3-graph01/directives/zoomable.directive';

declare var Hammer: any;
@Injectable()
export class HammerConfig extends GestureConfig  {
  buildHammer(element: HTMLElement) {
    return new GestureConfig({touchAction: 'pan-y'}).buildHammer(element);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    MatTableComponent,
    WebsocketComponent,
    NgxTableComponent,
    CytoGraphComponent,
    RxjsTutorialsComponent,
    CytoStreamComponent,

    QueryStateComponent,
    CytoTutorialsComponent,
    D3TutorialComponent,
    D3GraphComponent,
    D3ChartComponent,
    D3MetaSheetComponent,

    D3Graph01Component,
    D3graphComponent,
    D3nodeComponent,
    D3edgeComponent,
    DraggableDirective,
    ZoomableDirective
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,

    MatInputModule, MatListModule, MatIconModule, MatProgressBarModule, MatButtonModule,
    CdkTableModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatBottomSheetModule, MatSliderModule,

    NgxDatatableModule,

    AppRoutingModule
  ],
  exports: [
    CdkTableModule,
    CdkTreeModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
  ],
  providers: [ 
    D3GraphService,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }    
  ],
  // additional providers needed for this module
  entryComponents: [ D3MetaSheetComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
