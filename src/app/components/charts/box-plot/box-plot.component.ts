import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { TableColumn } from '../../../models/TableColumn.model';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';

@Component({
  selector: 'app-box-plot',
  templateUrl: './box-plot.component.html',
  styleUrls: ['./box-plot.component.scss']
})
export class BoxPlotComponent implements OnChanges {

  @Input() data: TableColumn[];
  @Input() selectedData: any;

  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width: number;
  private height: number;
  private xArray: Array<any>;
  private legendData: Array<any>;



  constructor() {

    this.width =  580 - this.margin.left - this.margin.right;
    this.height = 580 - this.margin.top - this.margin.bottom;

  }

  ngOnChanges($changes) {

      if (this.selectedData[0].length === 1) {
        // if only 1 column is selected
            if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
              const ans = [];
              this.xArray = [];
              const xarr = this.selectedData[this.selectedData.length - 1].data;
              const unique = xarr.filter((value, index, self) => self.indexOf(value) === index);


              this.xArray = unique;

              const  column = this.selectedData[0][0].colName;
              for (let i = 0; i < this.selectedData.length - 1; i++) {
              const temp = {};

// tslint:disable: no-string-literal
              temp['Species'] = this.selectedData[this.selectedData.length - 1].data[i];
              const x = this.selectedData[i][0].colName;
              temp[x] = this.selectedData[i][0].data;

              ans.push(temp);

          }

              this.createChart(ans, column);
        }


    }


  }

  updateChartHover(legendObj: {name: string, color: string}) {
    if (legendObj.name === '' && legendObj.color === '') {
      this.updateChartOnHoverEnd();
    } else {
      this.updateChartOnHover(legendObj);
    }
  }

  private updateChartOnHoverEnd() {
    d3.select('#boxplot').selectAll('.common-box').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const boxChart = d3.select('#boxplot');

    boxChart.selectAll('.common-box').style('opacity', '.2');
    boxChart.selectAll(`.box-${hoverElement.name}`).style('opacity', '1');
  }

  private hoverRectEnd(name1: string) {
    const boxPlot = d3.select('#boxplot');
    boxPlot.selectAll(`.box-${name1}`).style('opacity', '1');

  }



  private hoverRect(name1: string) {
    const boxPlot = d3.select('#boxplot');
    boxPlot.selectAll(`.box-${name1}`)
            .style('opacity', '0.6');
  }


  private createChart(data: any, column: any) {
        // alert('jj');

        d3.select('#boxplot').selectAll('svg').remove();

// append the svg object to the body of the page
        const svg = d3.select('#boxplot')
  .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
  .append('g')
    .attr('transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')');

        const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
// tslint:disable : only-arrow-functions
    .key(function(d: any) { return d.Species; })
    .rollup(function(d: any): any {
      const q1 = d3.quantile(d.map(function(g) {

        return g[column] ; }).sort(d3.ascending), .25);
      const median = d3.quantile(d.map(function(g) { return g[column]; }).sort(d3.ascending), .5);
      const q3 = d3.quantile(d.map(function(g) { return g[column]; }).sort(d3.ascending), .75);
      const interQuantileRange = q3 - q1;
      const min = q1 - 1.5 * interQuantileRange;
      const max = q3 + 1.5 * interQuantileRange;
      return({q1, median, q3, interQuantileRange, min, max});
    })
    .entries(data);

  // Show the X scale
        const x = d3.scaleBand()
    .range([ 0, this.width ])
    .domain( this.xArray)
    .paddingInner(1)
    .paddingOuter(.5);
        svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3.axisBottom(x));

  // Show the Y scale

  // const xMax = Number(d3.max(data.map((d) =>   Number(d.gdpPercap))));
        const yMin = Number(d3.min(data.map((d) => d[column])));
        const yMax = Number(d3.max(data.map((d) => d[column])));

        const y = d3.scaleLinear()
    .domain([yMin / 1.5, yMax * 1.2])
    .range([this.height, 0]);
        svg.append('g').call(d3.axisLeft(y));

  // Show the main vertical line
        svg
    .selectAll('vertLines')
    .data(sumstat)
    .enter()
    .append('line')
      .attr('x1', function(d) {

        return(x(d.key)); })
      .attr('x2', function(d) {return(x(d.key)); })
      .attr('y1', function(d: any) {return(y(d.value.min)); })
      .attr('y2', function(d: any) {return(y(d.value.max)); })
      .attr('stroke', 'black')
      .style('width', 40);

      // ext
        const color = d3Scale.scaleOrdinal()
    .range(['#00b894', '#fdcb6e', '#e17055', '#6c5ce7', '#1abc9c', '#c0392b', '#e67e22', '#f1c40f']);

        const jsonData = [];
        const jsonData1 = [];

        const tooltip = d3.select('#boxplot').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

        const obj = {};

  // rectangle for the main box
        const boxWidth = 100;
        svg
    .selectAll('boxes')
    .data(sumstat)
    .enter()
    .append('rect')
        .attr('class', (d) => {
          return `common-box box-${d.key}`;
        })
        .attr('x', function(d) {return(x(d.key) - boxWidth / 2); })
        .attr('y', function(d: any) {return(y(d.value.q3)); })
        .attr('height', function(d: any) {return(y(d.value.q1) - y(d.value.q3)); })
        .attr('width', boxWidth )
        .attr('stroke', 'black')
        .style('fill',  (d: any): any => {

          const temp = {
            name: d.key ,
            color: color(d.key)
          };
          jsonData.push(temp);
          return color(d.key);
        }).style('fill',  (d: any, j: any): any => {
            const t = jsonData.length;
            const temp = {
            name: d.key ,
            color: `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`
          };
            jsonData1.push(temp);
            obj[temp.name] = temp.color;
            return `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
        }).on('mousemove', (d) => {
          tooltip.style('opacity', 1);
// tslint:disable: max-line-length
          tooltip.html(` <div class="tooltipWrapper"> <span class="dot" style = "background-color : ${obj[d.key]} ;" ></span> <span style="font-weight: bold"> ${d.key} </span>`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${(d3.event.pageY - 28)}px`);
          this.hoverRect(d.key);
        }).on('mouseout', (d) => {
          tooltip.transition().duration(100).style('opacity', 0);
          this.hoverRectEnd(d.key);
        });


  // Show the median
        svg
    .selectAll('medianLines')
    .data(sumstat)
    .enter()
    .append('line')
      .attr('x1', function(d) {return(x(d.key) - boxWidth / 2); })
      .attr('x2', function(d) {return(x(d.key) + boxWidth / 2); })
      .attr('y1', function(d: any) {return(y(d.value.median)); })
      .attr('y2', function(d: any) {return(y(d.value.median)); })
      .attr('stroke', 'black')
      .style('width', 80);


// Add individual points with jitter
        const jitterWidth = 25;
        svg
  .selectAll('indPoints')
  .data(data)
  .enter()
  .append('circle')
    .attr('cx', function(d: any) {return(x(d.Species) - jitterWidth / 2 + Math.random() * jitterWidth ); })
    .attr('cy', function(d: any) {return(y(d[column])); })
    .attr('r', 3)
    .style('fill', 'white')
    .attr('stroke', 'black')
    // .on('mouseover', mouseover)
      // .on('mousemove', mousemove)
      // .on('mouseleave', mouseleave);
      .on('mouseover', (d) => {
        tooltip.style('opacity', 1);  // tooltip effects
        tooltip.html(`${column}: <span> ${d[column]} </span>`)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${(d3.event.pageY)}px`);

      })
      .on('mouseout', () => tooltip.style('opacity', 0));

        this.legendData = [...jsonData1];

  }

}


