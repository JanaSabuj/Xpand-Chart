import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolinPlotComponent } from './violin-plot.component';

describe('ViolinPlotComponent', () => {
  let component: ViolinPlotComponent;
  let fixture: ComponentFixture<ViolinPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolinPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolinPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
