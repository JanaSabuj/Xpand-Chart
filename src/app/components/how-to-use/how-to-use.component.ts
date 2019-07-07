import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss']
})
export class HowToUseComponent implements OnInit {
  @Output() closeModalEvent: EventEmitter<any>;

  constructor() {
    this.closeModalEvent = new EventEmitter();
  }

  ngOnInit() { }

  closeModal() {
    this.closeModalEvent.emit('Modal Closed');
  }
}
