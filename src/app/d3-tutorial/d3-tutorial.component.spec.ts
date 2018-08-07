import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TutorialComponent } from './d3-tutorial.component';

describe('D3TutorialComponent', () => {
  let component: D3TutorialComponent;
  let fixture: ComponentFixture<D3TutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
