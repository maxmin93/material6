import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoTutorialsComponent } from './cyto-tutorials.component';

describe('CytoTutorialsComponent', () => {
  let component: CytoTutorialsComponent;
  let fixture: ComponentFixture<CytoTutorialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoTutorialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
