import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonDateSliderComponent } from './ion-date-slider.component';

describe('IonDateSliderComponent', () => {
  let component: IonDateSliderComponent;
  let fixture: ComponentFixture<IonDateSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonDateSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonDateSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
