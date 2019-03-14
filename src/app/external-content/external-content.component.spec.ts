import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalContentComponent } from './external-content.component';

describe('ExternalContentComponent', () => {
  let component: ExternalContentComponent;
  let fixture: ComponentFixture<ExternalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
