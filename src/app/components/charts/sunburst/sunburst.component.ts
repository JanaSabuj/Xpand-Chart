import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3h from 'd3-hierarchy';
import { interpolate } from 'd3';

@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.scss']
})
export class SunburstComponent implements OnChanges {
  @Input() selectedData: any;

  private margin = {top: 20, right: 20, bottom: 20, left: 30};
  private width: number;
  private height: number;
  private radius: number;
  private legendData = {};
  private radiusInfo: {};
  private radiusArray: [];
  private xRad: string;

  constructor() {
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  ngOnChanges($changes: SimpleChanges) {
    if ($changes.selectedData && this.selectedData.length !== 0) {
      if (this.selectedData[this.selectedData.length - 1].primaryColumn) {
        this.parseDataPrimary();
      } else {
        this.parseDataID();
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

  parseDataPrimary() {
    const nodeData = {
      name: 'Total',
      children: []
    };
    for (let j = 0; j < this.selectedData[0].length; j++) {
      const temp = {
        name: this.selectedData[0][j].colName,
        children: []
      };
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.selectedData.length - 1; i++) {
        const temp2 = {
          name:  this.selectedData[this.selectedData.length - 1].data[i],
          size: this.selectedData[i][j].data
        };
        temp.children.push(temp2);
      }
      nodeData.children.push(temp);
    }
    this.createSunburst(nodeData);
  }

  parseDataID() {
    const nodeData = {
      name: 'Total',
      children: []
    };
    for (let j = 0; j < this.selectedData[0].length; j++) {
      const temp = {
        name: this.selectedData[0][j].colName,
        children: []
      };
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.selectedData.length - 1; i++) {
        const temp2 = {
          name: 'ID' + String(this.selectedData[i][j].rowNum + 1),
          size: this.selectedData[i][j].data
        };
        temp.children.push(temp2);
      }
      nodeData.children.push(temp);
    }
    this.createSunburst(nodeData);
  }

  private updateChartOnHoverEnd() {
    d3.select('#sunburst').selectAll('.common-pie').style('opacity', '1');
  }

  private updateChartOnHover(hoverElement: {name: string, color: string}) {
    const sunburst = d3.select('#sunburst');

    sunburst.selectAll('.common-pie').style('opacity', '.4');
    sunburst.selectAll(`.sun-${hoverElement.name}`).style('opacity', '1');
  }


  private hoverRectEnd(name1: string, name2: string,  curr: any) {

    const arc2 = d3Shape.arc()
    .startAngle((d: any) => {

      return curr.x0;
    })
    .endAngle((d: any) => curr.x1)
    .innerRadius((d: any) => curr.y0)
    .outerRadius((d: any) => curr.y1);

    const sunburst = d3.select('#sunburst');
    // sunburst.selectAll(`.sun-${name1}`).style('opacity', '1');
    if (name2 === 'error') {
        // sunburst.selectAll(`.sun-${name1}`).style('opacity', '1');
        sunburst.selectAll(`.sun-${name1}`)
                .style('opacity', 1);
        // .attr('d', arc2 as any);
    } else {
        sunburst.select(`.sun-${name2}-${name1}`)
        .style('opacity', 1)
        .transition()
        .duration(100)
        .attr('d', arc2 as any);
    }


  }



  private hoverRect1(name1: string, name2: string, curr: any) {

  const values = curr.data.children.map(d => d.name);
  const sunburst = d3.select('#sunburst');



// tslint:disable: prefer-for-of
  for (let i = 0; i < values.length; i++) {
      sunburst.selectAll( `.sun-${name1}-${values[i]}`)
      .style('opacity', '0.6');

    }

  }

  private hoverRect2(name1: string, name2: string, curr: any) {

    const arc2 = d3Shape.arc()
    .startAngle((d: any) => {
      return curr.x0 ;
    })
    .endAngle((d: any) => curr.x1 )
    .innerRadius((d: any) => curr.y0 )
    .outerRadius((d: any) => curr.y1 + 12);


    const sunburst = d3.select('#sunburst');
    sunburst.selectAll(`.sun-${name2}-${name1}`)
            .style('opacity', '0.6')
            .transition()
            .duration(100)
            .attr('d', arc2 as any);

  }


  createSunburst(nodeData: any) {
    d3Select.select('#sunburst').select('svg').remove();

    d3Select.select('#sunburst').append('svg')
                          .attr('width', `${this.width + 40}px`)
                          .attr('height', `${this.height + 40}px`);
                          // .attr('class', 'p-5');


    const g = d3Select.select('#sunburst')
          .select('svg')
          .append('g')
          .attr('transform', 'translate(' + (this.width + 40) / 2 + ',' + (this.height + 40) / 2 + ')');

    const partition = d3h.partition()
          .size([2 * Math.PI, this.radius])
          .padding(0);

    const root = d3h.hierarchy(nodeData)
        .sum((d: {name: string, size: number, children: []}) => {
          if (d.children) {
            return 0;
          } else {
            return d.size;
          }
        });
    partition(root);

    const arc = d3Shape.arc()
                  .startAngle((d: any) => {
                    return d.x0;
                  })
                  .endAngle((d: any) => {
                    return  d.x1;
                  })
                  .innerRadius((d: any) => {
                    return d.y0;
                  })
                  .outerRadius((d: any) => {
                   return d.y1;
                  });

    const tooltip = d3Select.select('#sunburst')
                      .append('div')
                      .style('opacity', 0)
                      .attr('class', 'tooltip');


    const obj = {};

    const mouseOver = (d) => tooltip.style('opacity', 1);
    const mouseMove = (d) => {
  // console.log(d);
  const currRadiusNode = d;
  tooltip.style('opacity', 1);
  const currentName = d.data.name;
  let curr = d;
  if (d.depth > 1) {
        while (d.depth > 1) { d = d.parent; }
        // return obj[d.data.name] ;
      }

// tslint:disable: max-line-length
// tslint:disable: no-use-before-declare
  tooltip.html(`<div class="tooltipWrapper"> <span class="dot" style = "background-color : ${obj[d.data.name]} ;" ></span> <span style="font-weight: bold"> ${currentName} </span>: <span> ${curr.value}  </span> </div>`)
        .style('left', (d3Select.event.pageX + 10) + 'px')
        .style('top', (d3Select.event.pageY) + 'px');

  if (curr.depth > 1) {

          while (curr.depth > 1) { curr = curr.parent; }

          this.hoverRect2(currentName, d.data.name, currRadiusNode);
        } else {
          this.hoverRect1(d.data.name, 'error', currRadiusNode);
      }
    };
    const mouseLeave = (d) => {
      const currRadiusNode = d;
      const currentName = d.data.name;
      let curr = d;

      tooltip.transition().duration(100).style('opacity', 0);

      if (curr.depth > 1) {
        while (curr.depth > 1) { curr = curr.parent; }
        this.hoverRectEnd(currentName, curr.data.name, currRadiusNode);
        while (d.depth > 1) { d = d.parent; }
      } else {
        this.hoverRectEnd(d.data.name, 'error', currRadiusNode);
      }
  };



    const jsonData = [];
    const t = this.selectedData[0].length;

    const color = d3Scale.scaleOrdinal()
    .range(['#34495e', '#9b59b6', '#3498db', '#2ecc71', '#1abc9c', '#c0392b', '#e67e22', '#f1c40f']);



    g.selectAll('g')
      .data(root.descendants())
      .enter().append('g').attr('class', 'node').append('path')
      .attr('class', (d: any) => {
        if (d.depth > 1) {
          const curr = d;

          while (d.depth > 1) { d = d.parent; }
          return `common-pie sun-${d.data.name} sun-${d.data.name}-${curr.data.name}`;
        } else {
            return `common-pie sun-${d.data.name}`;
        }
      })
  // tslint:disable-next-line: only-arrow-functions
      .attr('display', (d) => d.depth ? null : 'none')
      .attr( 'd', arc as any)
      .style('stroke', '#fff')
      .style('fill', (d: any, j: any): any => {



        if (d.depth === 1 && d.height === 1) {
          this.legendData[d.data.name] = color(d.data.name);
          if (jsonData.length < this.selectedData[0].length) {
            const temp = {
              name: d.data.name,
              color: `rgb(${255 *  (j / t)},${ 10 * j / t},${220 * (t - j) / t})`
            };
            jsonData.push(temp);
          }
        }
        obj[d.data.name] = `rgb(${255 *  (j / t)},${ 10 * j / t},${220 * (t - j) / t})`;

        if (d.depth > 1) {
          while (d.depth > 1) { d = d.parent; }
          return obj[d.data.name] ;
        }

        return `rgb(${255 *  (j / t)},${ 10 * j / t},${220 * (t - j) / t})`;
      })
      // .on('mouseover', mouseOver)
      .on('mousemove', mouseMove)
      .on('mouseleave', mouseLeave);
    ////////////////////

    const ans = [];
    for (let i = 0; i < this.selectedData[0].length; i++) {
      ans.push(jsonData[i]);
    }

    this.legendData = [...ans];


    g.selectAll('g')
        .transition()
        .duration(100);
  }
}
