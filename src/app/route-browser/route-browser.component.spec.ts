import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteBrowserComponent } from './route-browser.component';

describe('RouteBrowserComponent', () => {
  let component: RouteBrowserComponent;
  let fixture: ComponentFixture<RouteBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
