import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { TableColumn } from '../../../models/TableColumn.model';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';


@Component({
  selector: 'app-violin-plot',
  templateUrl: './violin-plot.component.html',
  styleUrls: ['./violin-plot.component.scss']
})
export class ViolinPlotComponent implements OnChanges {

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

          if (this.selectedData[this.selectedData.length - 1].primaryColumn === true) {
            const ans = [];
            this.xArray = [];
            const xarr = this.selectedData[this.selectedData.length - 1].data;


            function onlyUnique(value, index, self) {
              return self.indexOf(value) === index;
          }
            const unique = xarr.filter( onlyUnique );

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
  d3.select('#violinplot').selectAll('.common-violin').style('opacity', '1');
}

private updateChartOnHover(hoverElement: {name: string, color: string}) {
  const violinChart = d3.select('#violinplot');

  violinChart.selectAll('.common-violin').style('opacity', '.2');
  violinChart.selectAll(`.common-violin--${hoverElement.name}`).style('opacity', '1');
}

private hoverRectEnd(name1: string) {
  const violinPlot = d3.select('#violinplot');
  violinPlot.selectAll(`.common-violin--${name1}`).style('opacity', '1');

}



private hoverRect(name1: string) {
  const boxPlot = d3.select('#violinplot');
  boxPlot.selectAll(`.common-violin--${name1}`)
          .style('opacity', '0.6');
}


private createChart(data: any, column: any) {

  d3.select('#violinplot').selectAll('svg').remove();



  const svg = d3.select('#violinplot')
  .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
  .append('g')
    .attr('transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')');

  const yMin = Number(d3.min(data.map((d) => d[column])));
  const yMax = Number(d3.max(data.map((d) => d[column])));


  const y = d3.scaleLinear()
    .domain([ yMin / 1.5, yMax * 1.5 ])          // Note that here the Y scale is set manually
    .range([this.height, 0]);
  svg.append('g').call( d3.axisLeft(y) );

// tslint:disable: max-line-length
  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  const x = d3.scaleBand()
    .range([ 0, this.width ])
    .domain( this.xArray)
    .padding(0.05);     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  svg.append('g')
    .attr('transform', 'translate(0,' + this.height + ')')
    .call(d3.axisBottom(x));
    // .text('hello');

  // Features of density estimate
  const kde = this.kernelDensityEstimator(this.kernelEpanechnikov(.2), y.ticks(50));

  // Compute the binning for each group of the dataset
  const sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
// tslint:disable: only-arrow-functions
    .key(function(d: any) { return d.Species; })
    .rollup(function(d) {   // For each key..
      const input = d.map(function(g: any) { return g[column]; });    // Keep the variable called[column]
      const density = kde(input);   // And compute the binning on it.
      return(density);
    })
    .entries(data);

  // What is the biggest value that the density estimate reach?
  let maxNum = 0;
// tslint:disable-next-line: forin
  for ( const i in sumstat ) {
    const allBins: any = sumstat[i].value;
    const kdeValues = allBins.map(function(a) {return a[1]; });
    const biggest: any = d3.max(kdeValues);
    if (biggest > maxNum) { maxNum = biggest; }
  }

  // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
  const xNum = d3.scaleLinear()
    .range([0, x.bandwidth()])
    .domain([-maxNum, maxNum]);


  const tooltip = d3.select('#violinplot').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const color = d3Scale.scaleOrdinal()
    .range(['#00b894', '#fdcb6e', '#e17055', '#6c5ce7', '#1abc9c', '#c0392b', '#e67e22', '#f1c40f']);

  const jsonData = [];
  const jsonData1 = [];

  const obj = {};

  // Add the shape to this svg!
  const dd = svg
    .selectAll('myViolin')
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append('g')
      .attr('transform', function(d) { return('translate(' + x(d.key) + ' ,0)'); } ) // Translation on the right to be at the group position
    .append('path')
    .attr('class', (d) => {

      return `common-violin common-violin--${d.key}`;
    })
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
  });



  dd.datum(function(d) {

    return(d.value);
   })     // So now we are working density per density
        .style('stroke', 'none')
        .attr('d', d3.area()
            .x0(function(d) { return(xNum(-d[1])); } )
            .x1(function(d) { return(xNum(d[1])); } )
            .y(function(d) { return(y(d[0])); } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        );

  this.legendData = [...jsonData1];

}

  private kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v: any) { return kernel(x - v); })];
    });
  };
}
  private kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}



}


