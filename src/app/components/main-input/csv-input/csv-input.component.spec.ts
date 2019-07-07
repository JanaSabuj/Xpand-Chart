import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvInputComponent } from './csv-input.component';

describe('CsvInputComponent', () => {
  let component: CsvInputComponent;
  let fixture: ComponentFixture<CsvInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
