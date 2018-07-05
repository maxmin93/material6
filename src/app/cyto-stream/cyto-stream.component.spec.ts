import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CytoStreamComponent } from './cyto-stream.component';

describe('CytoStreamComponent', () => {
  let component: CytoStreamComponent;
  let fixture: ComponentFixture<CytoStreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CytoStreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CytoStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
