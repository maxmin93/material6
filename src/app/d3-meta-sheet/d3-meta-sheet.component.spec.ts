import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3MetaSheetComponent } from './d3-meta-sheet.component';

describe('D3MetaSheetComponent', () => {
  let component: D3MetaSheetComponent;
  let fixture: ComponentFixture<D3MetaSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3MetaSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3MetaSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
