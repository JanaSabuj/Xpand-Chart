import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainInputComponent } from './components/main-input/main-input.component';
import { CustomTableComponent } from './components/custom-table/custom-table.component';
import { FileUploadComponent } from './components/main-input/file-upload/file-upload.component';
import { ColumnSelectorComponent } from './components/main-input/column-selector/column-selector.component';
import { TableHeaderComponent } from './components/custom-table/table-header/table-header.component';
import { TableBodyComponent } from './components/custom-table/table-body/table-body.component';
import { ChartsComponent } from './components/charts/charts.component';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component';
import { ScatterPlotComponent } from './components/charts/scatter-plot/scatter-plot.component';
import { LinePlotComponent } from './components/charts/line-plot/line-plot.component';
import { ChartLegendComponent } from './components/charts/chart-legend/chart-legend.component';
import { ChartSelectorComponent } from './components/charts/chart-selector/chart-selector.component';
import { BubbleChartComponent } from './components/charts/bubble-chart/bubble-chart.component';
import { BoxPlotComponent } from './components/charts/box-plot/box-plot.component';
import { StackedAreaComponent } from './components/charts/stacked-area/stacked-area.component';
import { ViolinPlotComponent } from './components/charts/violin-plot/violin-plot.component';
import { SunburstComponent } from './components/charts/sunburst/sunburst.component';
import { ChartComponent } from './components/charts/chart/chart.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';
import { ChartInfoComponent } from './components/chart-info/chart-info.component';
import { ExportChartComponent } from './components/export-chart/export-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainInputComponent,
    CustomTableComponent,
    FileUploadComponent,
    ColumnSelectorComponent,
    TableHeaderComponent,
    TableBodyComponent,
    ChartsComponent,
    BarChartComponent,
    PieChartComponent,
    ScatterPlotComponent,
    LinePlotComponent,
    ChartLegendComponent,
    ChartSelectorComponent,
    BubbleChartComponent,
    BoxPlotComponent,
    StackedAreaComponent,
    ViolinPlotComponent,
    SunburstComponent,
    ChartComponent,
    HowToUseComponent,
    ChartInfoComponent,
    ExportChartComponent,
  ],
  imports: [
    BrowserModule,
    DragDropModule,
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
