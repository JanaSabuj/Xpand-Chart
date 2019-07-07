import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaComponent } from './stacked-area.component';

describe('StackedAreaComponent', () => {
  let component: StackedAreaComponent;
  let fixture: ComponentFixture<StackedAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
