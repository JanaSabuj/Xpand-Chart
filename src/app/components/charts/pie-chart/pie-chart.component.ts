import { Component, Input, OnChanges, ElementRef, Output, EventEmitter } from '@angular/core';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';


@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges {
  @Input() selectedData: any;

  private models: Array<any>;
  private total: number;

  private margin = {top: 20, right: 30, bottom: 20, left: 30};
  private width: number;
  private height: number;
  private radius: number;

  private arc: any;
  private labelArc: any;
  private pie: any;
  private color: any;
  private svg: any;
  private legendData: Array<any>;

  constructor() {
      this.width = 500 - this.margin.left - this.margin.right ;
      this.height = 500 - this.margin.top - this.margin.bottom;
      this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnChanges($changes: any) {
    if ($changes.selectedData) {
      d3.select('#piechart').selectAll('svg').remove();
      d3.select('#piechart').append('svg').attr('class', 'pie-chart-svg');
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
    d3.select('#piechart').selectAll('.arc').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const pieChart = d3.select('#piechart');

    pieChart.selectAll('.arc').style('opacity', '.4');
    pieChart.selectAll(`.pie-${hoverElement.name}`).style('opacity', '1');
  }

  private parseData() {
      // 1 column plot
    if (this.selectedData[0].length === 1) {
      if (this.selectedData[this.selectedData.length - 1 ].primaryColumn === true) {
        this.models = [];
        this.total = 0;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.selectedData.length - 1; i++) {
          const temp = {
            age: this.selectedData[this.selectedData.length - 1].data[i],
            population: this.selectedData[i][0].data
          };
          if (typeof(this.selectedData[i][0].data) === 'string') {
            temp.population = 0;
          }
          this.total = this.total + temp.population;
          this.models.push(temp);
        }
        this.initSvg();
        this.drawPie();
      } else {
        this.models = [];
        this.total = 0;
// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.selectedData.length - 1; i++) {
          const temp = {
            age: 'ID' + String(this.selectedData[i][0].rowNum + 1),
            population: this.selectedData[i][0].data
          };
          if (typeof(this.selectedData[i][0].data) === 'string') {
            temp.population = 0;
          }
          this.total = this.total + temp.population;
          this.models.push(temp);
        }
        this.initSvg();
        this.drawPie();
      }
    } else if (this.selectedData.length === 2) {
      if (this.selectedData[this.selectedData.length - 1].primaryColumn === false) {

        this.models = [];
        this.total = 0;

// tslint:disable: prefer-for-of
        for (let j = 0; j < this.selectedData[0].length; j++) {

          const temp = {
            age: this.selectedData[0][j].colName,
            population: this.selectedData[0][j].data
          };



          if (typeof(temp.population) === 'string') {
            temp.population = 0;
          }
          this.total = this.total + temp.population;
          this.models.push(temp);
        }
        this.initSvg();
        this.drawPie();
      } else {

        this.models = [];
        this.total = 0;
// tslint:disable-next-line: prefer-for-of
        for (let j = 0; j < this.selectedData[0].length; j++) {

          const temp = {
            age: this.selectedData[0][j].colName,
            population: this.selectedData[0][j].data
          };


          if (typeof(temp.population) === 'string') {
            temp.population = 0;
          }
          this.total = this.total + temp.population;
          this.models.push(temp);
        }
        this.initSvg();
        this.drawPie();
      }
    }
  }


  private hoverRectEnd(name1: string) {
    const pieChart = d3.select('#piechart');
    pieChart.selectAll(`.pie-${name1}`).style('opacity', '1');

  }



  private hoverRect(name1: string) {

    const pieChart = d3.select('#piechart');
    pieChart.selectAll(`.pie-${name1}`)
            .style('opacity', '0.6');


  }

  private initSvg() {
    this.color = d3Scale.scaleOrdinal()
        .range(['#fbc531', '#4cd137', '#9c88ff', '#c23616', '#00a8ff', '#e84118', '#192a56', '#1abc9c']);
    this.arc = d3Shape.arc()
        .outerRadius(this.radius - 10)
        .innerRadius(0);
    this.labelArc = d3Shape.arc()
        .outerRadius(this.radius - 40)
        .innerRadius(this.radius - 40);
    this.pie = d3Shape.pie()
        .sort(null)
        .value((d: any) => d.population);
    this.svg = d3.select('#piechart')
      .select('svg')
      .attr('width', `${this.radius * 2}px`)
      .attr('height', `${this.radius * 2}px`)
        .append('g')
        .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }

  private drawPie() {
    const tooltip = d3.select('#piechart').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                    // .style('color', '#fefefe')
                    // .style('background', '#222')
                    // .style('padding', '.35rem')
                    // .style('border', '1px solid black');

    const circleTooltip = {};

    const g = this.svg.selectAll('.arc')
          .data(this.pie(this.models))
          .enter().append('g')
          .attr('class', (d) => {
            return `arc pie-${d.data.age}`;
          })
          .on('mousemove', (d) => {
              tooltip.transition().duration(200).style('opacity', 1);  // tooltip effects
// tslint:disable-next-line: max-line-length
              tooltip.html(` <div class="tooltipWrapper"> <span class="dot" style = "background-color : ${circleTooltip[d.data.age]} ;" ></span> <span style="font-weight: bold"> ${d.data.age}: </span> <span> ${d.data.population} (${ Math.round( 1000 * d.data.population / this.total) / 10}%) </span> </div>`)
              .style('left', `${d3.event.pageX}px`)
              .style('top', `${(d3.event.pageY - 28)}px`);

              this.hoverRect(d.data.age);

          })
          .on('mouseout', (d) => {

          tooltip.transition().duration(100).style('opacity', 0);
          this.hoverRectEnd(d.data.age);
        });

    const t = this.models.length;
    const jsonData = [];



    g.append('path').attr('d', this.arc)
      .style('fill', (d: any, j: any) => {
        const temp = {
          name: d.data.age,
          color: `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`
        };
        jsonData.push(temp);
        const key = temp.name;
        const value = temp.color;
        circleTooltip[key] = value;
        return `rgb(${255 *  (t - j) / t},${ 0 * j / t},${255 * j / t})`;
      });

    this.svg.selectAll('.arc')
      .transition()
      .duration(100);
    // this.readLegend.emit(jsonData);
    this.legendData = [...jsonData];
  }
}
