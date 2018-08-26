import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3Graph01Component } from './d3-graph01.component';

describe('D3Graph01Component', () => {
  let component: D3Graph01Component;
  let fixture: ComponentFixture<D3Graph01Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3Graph01Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3Graph01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
