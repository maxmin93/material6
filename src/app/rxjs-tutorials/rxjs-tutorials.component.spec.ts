import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RxjsTutorialsComponent } from './rxjs-tutorials.component';

describe('RxjsTutorialsComponent', () => {
  let component: RxjsTutorialsComponent;
  let fixture: ComponentFixture<RxjsTutorialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RxjsTutorialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RxjsTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
