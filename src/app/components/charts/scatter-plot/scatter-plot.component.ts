import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableColumn } from '../../../models/TableColumn.model';

import * as d3 from 'd3';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss']
})
export class ScatterPlotComponent implements OnChanges {
  @Input() selectedData: any;

  private margin = {top: 10, right: 30, bottom: 30, left: 60};
  private width: number;
  private height: number;
  private legendData: any;

  constructor() {
    this.selectedData = [];
    this.width = 560 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnChanges($changes: SimpleChanges) {


    if ($changes.selectedData) {
      if (this.selectedData[this.selectedData.length - 1].primaryColumn) {
        this.parseDataPrimary($changes.selectedData.currentValue);
      } else {
        this.parseDataID($changes.selectedData.currentValue);
      }
    }
  }

  parseDataID(selectedData: any) {


    if (selectedData[0].length === 2) {
      const primaryColumn = {
        colName: 'ID',
        data: selectedData.slice(0, selectedData.length - 1).map(
                (row: {colName: string, data: any, rowNum: number}) => {
                return 'ID' + String(row[0].rowNum + 1);
              })
      };
      const xValues = selectedData.slice(0, selectedData.length - 1).map(
        (row: {colName: string, data: any, rowNum: number}) => {
        return {
          xValue: row[0].data,
          xColName: row[0].colName
        };
      });
      const yValues = selectedData.slice(0, selectedData.length - 1).map(
        (row: {colName: string, data: any, rowNum: number}) => {
        return {
          yValue: row[1].data,
          yColName: row[1].colName
        };
      });
      const data = [];
      for (let i = 0; i < xValues.length; i++) {
        data.push({
          xValue: xValues[i].xValue,
          xColName: xValues[i].xColName,
          yValue: yValues[i].yValue,
          yColName: yValues[i].yColName,
          pCol: primaryColumn.data[i]
        });
      }
      const maxElementX = d3.max(xValues.map(element => element.xValue));
      const maxElementY = d3.max(yValues.map(element => element.yValue));
      const minElementX = d3.min(xValues.map(element => element.xValue));
      const minElementY = d3.min(yValues.map(element => element.yValue));
      this.createChartWithPrimary(data, primaryColumn, maxElementX, maxElementY, minElementX, minElementY);
    }
  }

  parseDataPrimary(selectedData: any) {
    if (selectedData[0].length === 2 && selectedData[selectedData.length - 1].primaryColumn) {
      const xValues = selectedData.slice(0, selectedData.length - 1).map((row, index) => {
        return {
          xValue: row[0].data,
          colName: row[0].colName
        };
      });
      const yValues = selectedData.slice(0, selectedData.length - 1).map(row => {
        return {
          yValue: row[1].data,
          colName: row[1].colName
        };
      });
      const maxElementX = d3.max(xValues.map(element => element.xValue));
      const maxElementY = d3.max(yValues.map(element => element.yValue));
      const minElementX = d3.min(xValues.map(element => element.xValue));
      const minElementY = d3.min(yValues.map(element => element.yValue));
      const primaryColumn = {
        colName: selectedData[selectedData.length - 1].colName,
        data: selectedData[selectedData.length - 1].data
      };
      const data = [];
      for (let i = 0; i < xValues.length; i++) {
        data.push({
          xValue: xValues[i].xValue,
          yValue: yValues[i].yValue,
          pCol: primaryColumn.data[i]
        });
      }

      this.createChartWithPrimary(data, primaryColumn, maxElementX, maxElementY, minElementX, minElementY);
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
    d3.select('#scatterplot').selectAll('.bubbles').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const scatterChart = d3.select('#scatterplot');

    scatterChart.selectAll('.bubbles').style('opacity', '.2');
    scatterChart.selectAll(`.scatter-${hoverElement.name}`).style('opacity', '1');
  }


  createChartWithPrimary( inputData: Array<any>, primaryCol: {colName: string, data: []}, xMax: number | string,
                          yMax: number | string, xMin: number | string, yMin: number | string) {
    d3.select('#scatterplot')
      .selectAll('svg').remove();

    const data = inputData;
    const svg = d3.select('#scatterplot')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right + 20)
      .attr('height', this.height + this.margin.top + this.margin.bottom + 20)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    const x = d3.scaleLinear()
      .domain([0, 0])
      .range([0, this.width]);

    svg.append('g')
      .attr('class', 'myXaxis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3.axisBottom(x))
      .attr('opacity', 0);

    const y = d3.scaleLinear()
      .domain([Number(yMin), Number(yMax)])
      .range([this.height, 0]);

    const columnNames = this.selectedData[0].map(col => col.colName);

    svg.append('g').call(d3.axisLeft(y));
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
        .text(`${columnNames[1]}`);

    const tooltip = d3.select('#scatterplot')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip');
      // .style('background-color', 'white')
      // .style('border', '1px solid black')
      // .style('border-width', '1px')
      // .style('padding', '16px');

    const colorObj = {};


    const mouseOver = (d) => tooltip.style('opacity', 1);
    const mouseMove = (d: {xValue: number, yValue: number, pCol: string}) => {


// tslint:disable-next-line: max-line-length
      tooltip.html(` <div class="tooltipWrapper"> <span class="dot" style = "background-color : ${colorObj[d.pCol]} ;" ></span> <span  style="font-weight: bold"> ${d.pCol} </span>:  <span>  ${d.xValue} </span> , <span>  ${d.yValue} </span> </div>`)
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY) + 'px');
    };
    const mouseLeave = (d) => {
      tooltip.transition().duration(200).style('opacity', 0);
    };


    const unique = primaryCol.data.filter((value, index, self) => self.indexOf(value) === index);
    const colorArray = [];
    const t = unique.length;
    for (let i = 0; i < t; i++) {
      const key: any = unique[i];
      const value = `rgb(${255 *  (t - i) / t},${50 * i / t},${255 * i / t})` ;
      colorObj[key] = value;
      colorArray.push(`rgb(${255 *  (t - i) / t},${50 * i / t},${255 * i / t})`);
    }




    const color = d3.scaleOrdinal()
      .domain([...primaryCol.data])
      .range(colorArray);

    svg.append('g').selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', (d) => {
          return `bubbles scatter-${d.pCol}`;
        })
          .attr('cx', (d: {xValue: number, yValue: number}) => x(d.xValue))
          .attr('cy', (d: {xValue: number, yValue: number}) => y(d.yValue))
          .attr('r', 3.5)
          .style('fill', (d: {pCol: string}): string | any => color(d.pCol))
        .on('mouseover', mouseOver)
        .on('mousemove', mouseMove)
        .on('mouseleave', mouseLeave);

    x.domain([Number(xMin), Number(xMax)]);

    svg.select('.myXaxis')
      .transition()
      .duration(1000);
    svg.select('.myXaxis')
      .call(d3.axisBottom(x))
      .attr('opacity', 1);

    svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'end')
      .attr('x', this.width)
      .attr('y', this.height + 30)
      .style('font-size', '.75rem')
      .style('color', '#353535')
      .style('font-weight', '700')
      .style('text-transform', 'capitalize')
      .text(`${columnNames[0]}`);

    svg.selectAll('circle')
      .transition()
      .delay((d, i) => (i * 3))
      .duration(1000)
      .attr('cx', (d: {xValue: number, yValue: number}) => x(d.xValue))
      .attr('cy', (d: {xValue: number, yValue: number}) => y(d.yValue));

    if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
        const a = this.selectedData[this.selectedData.length - 1].data;

        const jsonData = [];
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < unique.length ; i++) {
          const temp = {
            name: unique[i],
            color: color(unique[i])
          };
          jsonData.push(temp);
        }
        this.legendData = jsonData;
      } else {
        const a = data.map( (d) => d.pCol);
        const jsonData = [];
  // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < a.length ; i++) {
          const temp = {
            name: a[i],
            color: color(a[i])
          };
          jsonData.push(temp);
        }
        this.legendData = jsonData;
      }
  }
}
