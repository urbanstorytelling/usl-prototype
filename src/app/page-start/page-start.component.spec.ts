import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStartComponent } from './page-start.component';

describe('PageStartComponent', () => {
  let component: PageStartComponent;
  let fixture: ComponentFixture<PageStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
