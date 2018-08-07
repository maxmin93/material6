import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CdkTableModule } from '@angular/cdk/table';
import {
  MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
  MatCardModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule,
  MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule, MatProgressBarModule,
  MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule,
  MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule,
  MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule, 
  MatFormFieldModule
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

    D3ChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatFormFieldModule, MatInputModule, MatIconModule, MatProgressBarModule,
    MatButtonModule,
    CdkTableModule, MatTableModule, MatPaginatorModule, MatSortModule,
    
    NgxDatatableModule,

    AppRoutingModule
  ],
  exports: [
    CdkTableModule,
    MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonModule, MatButtonToggleModule,
    MatCardModule, MatCheckboxModule, MatChipsModule, MatStepperModule, MatDatepickerModule,
    MatDialogModule, MatDividerModule, MatExpansionModule, MatGridListModule, MatIconModule,
    MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatPaginatorModule,
    MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatRippleModule, MatSelectModule,
    MatSidenavModule, MatSliderModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule,
    MatTableModule, MatTabsModule, MatToolbarModule, MatTooltipModule, MatTreeModule, 
    MatFormFieldModule
  ],
  providers: [  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
