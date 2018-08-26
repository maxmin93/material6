import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoAnimateComponent } from './cyto-animate.component';

describe('CytoAnimateComponent', () => {
  let component: CytoAnimateComponent;
  let fixture: ComponentFixture<CytoAnimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoAnimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoAnimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
