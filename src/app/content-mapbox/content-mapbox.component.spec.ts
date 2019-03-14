import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMapboxComponent } from './content-mapbox.component';

describe('ContentMapboxComponent', () => {
  let component: ContentMapboxComponent;
  let fixture: ComponentFixture<ContentMapboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentMapboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentMapboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
