import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonRangeSliderComponent } from './ion-range-slider.component';

describe('IonRangeSliderComponent', () => {
  let component: IonRangeSliderComponent;
  let fixture: ComponentFixture<IonRangeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonRangeSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
