import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoGraphComponent } from './cyto-graph.component';

describe('CytoGraphComponent', () => {
  let component: CytoGraphComponent;
  let fixture: ComponentFixture<CytoGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
