import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faQuestionCircle, faChartLine} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faQuestionCircle = faQuestionCircle;
  faChartLine = faChartLine;
  @Output() modalOpenEvent: EventEmitter<any>;
  @Output() chartInfoOpenEvent: EventEmitter<any>;

  constructor() {
    this.modalOpenEvent = new EventEmitter();
    this.chartInfoOpenEvent = new EventEmitter();
  }

  ngOnInit() { }

  modalOpen() {
    this.modalOpenEvent.emit('Modal open');
  }

  openChartInfo() {
    this.chartInfoOpenEvent.emit('Chart info opened');
  }
}
