import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngTableComponent } from './ang-table.component';

describe('AngTableComponent', () => {
  let component: AngTableComponent;
  let fixture: ComponentFixture<AngTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
