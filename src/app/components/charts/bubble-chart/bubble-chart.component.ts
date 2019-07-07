import { Component, OnChanges, Input } from '@angular/core';
import { TableColumn } from '../../../models/TableColumn.model';

import * as d3 from 'd3';
import { ColumnSelectorComponent } from '../../main-input/column-selector/column-selector.component';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnChanges {

  @Input() data: TableColumn[];
  @Input() selectedData: any;

  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width: number;
  private height: number;
  private xArray: Array<any>;
  private legendData: Array<any>;



  constructor() {
    this.width = 530 - this.margin.left - this.margin.right;
    this.height = 470 - this.margin.top - this.margin.bottom;

  }



  ngOnChanges($changes) {
    if ($changes.selectedData) {
      this.parseData();
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
    d3.select('#bubblechart').selectAll('.bubbles').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const bubbleChart = d3.select('#bubblechart');

    bubbleChart.selectAll('.bubbles').style('opacity', '.2');
    bubbleChart.selectAll(`.bubble-${hoverElement.name}`).style('opacity', '1');
  }


  parseData() {
    if (this.selectedData[this.selectedData.length - 1].primaryColumn === false) {

      const fiveData = [];
      this.xArray = [];
      for (let i = 0; i < this.selectedData.length - 1; i++) {

        const temp = {};

        const ids = ['primary', 'xVal', 'yVal', 'zVal'];

        for (let j = 0; j < this.selectedData[0].length + 1; j++) {

          if (j === 0) {
            temp[ids[j]] =  'ID' + String( this.selectedData[i][0].rowNum + 1 );
            this.xArray.push(temp[ids[j]]);
            continue;
          }
          let x = this.selectedData[i][j - 1].data;
          x = String(x);
          temp[ids[j]] = x;
        }
        fiveData.push(temp);
      }


      this.createChart(fiveData);
    } else {
      const fiveData = [];
      this.xArray = [];

      for (let i = 0; i < this.selectedData.length - 1; i++) {
      const temp = {};
      const ids = ['primary', 'xVal', 'yVal', 'zVal'];
      for (let j = 0; j < this.selectedData[0].length + 1; j++) {

        if (j === 0) {
          temp[ids[j]] =  this.selectedData[this.selectedData.length - 1].data[i];
          this.xArray.push(temp[ids[j]]);
          continue;
        }

        let x = this.selectedData[i][j - 1].data;
        x = String(x);
        temp[ids[j]] = x;
      }

      fiveData.push(temp);

    }

      this.createChart(fiveData);
    }
  }

  createChart( data: any) {
    d3.select('#bubblechart').select('svg').remove();

    // append the svg object to the body of the page
    const svg = d3.select('#bubblechart')
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right + 20)
        .attr('height', this.height + this.margin.top + this.margin.bottom + 30)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const xMax = Number(d3.max(data.map((d) =>   Number(d.xVal))));
    const xMin = Number(d3.min(data.map((d) =>   Number(d.xVal))));

    const yMax = Number(d3.max(data.map((d) =>   Number(d.yVal))));
    const yMin = Number(d3.min(data.map((d) =>   Number(d.yVal))));

    const zMax = Number(d3.max(data.map((d) =>   Number(d.zVal))));
    const zMin = Number(d3.min(data.map((d) =>   Number(d.zVal))));

    const columnName = this.selectedData[0].map(col => col.colName);

    const x = d3.scaleLinear()
          .domain([xMin , xMax])
          .range([ 0, this.width ]);
    svg.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3.axisBottom(x));

    svg.append('text')
        .attr('class', 'x-label')
        .attr('text-anchor', 'end')
        .attr('x', this.width)
        .attr('y', this.height + 30)
        .style('font-size', '.75rem')
        .style('color', '#353535')
        .style('font-weight', '700')
        .style('text-transform', 'capitalize')
        .text(`${columnName[0]}`);

        // Add Y axis
    const y = d3.scaleLinear()
          .domain([yMin, yMax])
          .range([ this.height, 0]);
    svg.append('g')
          .call(d3.axisLeft(y));

    svg.append('text')
        .attr('class', 'y-label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .style('font-size', '.75rem')
        .style('color', '#353535')
        .style('font-weight', '700')
        .style('text-transform', 'capitalize')
        .text(`${columnName[1]}`);

        // Add a scale for bubble size
    const z = d3.scaleLinear()
          .domain([zMin, zMax])
          .range([ 4, 30]);
    let unique = [];
    let colorArray = [];
    if (this.selectedData[this.selectedData.length - 1].primaryColumn) {
      colorArray = [];
      unique = this.selectedData[this.selectedData.length - 1].data.filter((value, index, self) => self.indexOf(value) === index);
      const t = unique.length;
      for (let i = 0; i < t; i++) {
        colorArray.push(`rgb(${255 *  (t - i) / t},${50 * i / t},${255 * i / t})`);
      }
    } else {
      colorArray = [];
      const t = data.map((d) => d.primary).length;
      for (let i = 0; i < t; i++) {
        colorArray.push(`rgb(${255 *  (t - i) / t},${50 * i / t},${255 * i / t})`);
      }
    }
        // Add a scale for bubble color
    const myColor = d3.scaleOrdinal()
          .domain(this.xArray)
          .range(colorArray);



        // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select('#bubblechart')
          .append('div')
            .style('opacity', 0)
            .attr('class', 'tooltip');

        // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
// tslint:disable-next-line: only-arrow-functions
    const showTooltip = function(d) {
          tooltip
            .style('opacity', 1)
            // .html(`${d.primary}, ${columnName[2]}: ${d.zVal}`)
// tslint:disable: max-line-length
            .html(`<div class="tooltipWrapper"> <span class="dot" style = "background-color : ${myColor(d.primary)} ;" ></span> <span style="font-weight: bold" > ${columnName[2]} </span> : <span>  ${d.zVal} </span> </div>`)
            .style('left', `${d3.event.pageX }px`)
            .style('top', `${d3.event.pageY }px`);
        };
// tslint:disable-next-line: only-arrow-functions
    const moveTooltip = function(d) {
          tooltip
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY}px`);
        };
      // tslint:disable-next-line: only-arrow-functions
    const hideTooltip = function(d) {
          tooltip
            .style('opacity', 0);
        };


        // Add dots
    svg.append('g')
          .selectAll('dot')
          .data(data)
          .enter()
          .append('circle')
            .attr('class', (d: any) => {

              return `bubbles bubble-${d.primary}`;
            })
            .style('opacity', 0.7)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 3)
      // tslint:disable-next-line: only-arrow-functions
            .attr('cx', function(d: any) { return x(d.xVal); } )
      // tslint:disable-next-line: only-arrow-functions
            .attr('cy', function(d: any) { return y(d.yVal); } )
      // tslint:disable-next-line: only-arrow-functions
            .attr('r', function(d: any) { return z(d.zVal); } )
// tslint:disable-next-line: only-arrow-functions
            .style('fill', function(d: any): any {
              return myColor(d.primary);
            } );
            // .style('fill', 'red')
          // -3- Trigger the functions


    if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
      const a = this.selectedData[this.selectedData.length - 1].data;
      const jsonData = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < unique.length ; i++) {
        const temp = {
          name: unique[i],
          color: myColor(unique[i])
        };

        jsonData.push(temp);
      }
      this.legendData = jsonData;
    } else {
      const a = data.map((d) => d.primary);
      const jsonData = [];
// tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < a.length ; i++) {
        const temp = {
          name: a[i],
          color: myColor(a[i])
        };

        jsonData.push(temp);
      }
      this.legendData = jsonData;
    }


    svg.selectAll('circle')
          .on('mouseover', showTooltip )
          .on('mousemove', moveTooltip )
          .on('mouseleave', hideTooltip );
    }
  }
