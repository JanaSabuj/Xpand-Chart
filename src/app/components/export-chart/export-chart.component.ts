import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-export-chart',
  templateUrl: './export-chart.component.html',
  styleUrls: ['./export-chart.component.scss']
})
export class ExportChartComponent implements OnInit {
  @Input() chartName: string;

  constructor() {
    this.chartName = '';
  }

  ngOnInit() {}

  exportClicked($event: MouseEvent) {
    $event.preventDefault();
    const chart = document.getElementById(this.chartName);
    const svg = chart.childNodes[0];
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    // add xml declaration
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    // convert svg source to URI data scheme.
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'xpand.svg');
    a.setAttribute('target', '_blank');
    a.dispatchEvent(clickEvent);
    console.log('dspatched event');
  }
}
