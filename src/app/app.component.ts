import { Component } from '@angular/core';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

import { TableColumn } from './models/TableColumn.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  showModal: boolean;
  showChartInfo: boolean;
  data: TableColumn[];

  inputData: Array<{}>;
  headers: string[];
  selectedData: Array<{}>;
  isDataLoaded: boolean;
  isFullScreen: boolean;
  offset = 0;

  constructor() {
    this.inputData = [];
    this.headers = [];
    this.isDataLoaded = false;
    this.selectedData = [];
    this.isFullScreen = false;
    this.showModal = false;
    this.showChartInfo = false;
  }

  openDrawer() {
    this.isFullScreen = false;
    const mainInput = document.getElementById('main-input');
    const sectionDivider = document.getElementById('section-divider');
    const dataVisualizer = document.getElementById('data-visualiser');
    mainInput.style.width = '47%';
    sectionDivider.style.width = '3%';
    dataVisualizer.style.width = '50%';
    this.offset = 0;
  }

  closeDrawer() {
    this.isFullScreen = true;
    const mainInput = document.getElementById('main-input');
    const sectionDivider = document.getElementById('section-divider');
    const dataVisualizer = document.getElementById('data-visualiser');
    mainInput.style.width = '0';
    sectionDivider.style.width = '3%';
    dataVisualizer.style.width = '97%';
    this.offset = 500;
  }

  toggleModal($event: MouseEvent) {
    this.showModal = !this.showModal;
  }

  toggleChartInfo($event: MouseEvent) {
    this.showChartInfo = !this.showChartInfo;
  }

  setHeaders(headerArray: Array<any>) {
    this.headers = [...headerArray];
    this.isDataLoaded = true;
  }

  receiveHeaders($event: any) {
    this.setHeaders($event);
  }

  receiveColumns($event: any) {
    this.data = $event;
  }

  receiveData($event: any) {
    this.inputData = $event;
  }

  receiveSelectedData($event: any) {
    this.selectedData = $event;
  }
}
