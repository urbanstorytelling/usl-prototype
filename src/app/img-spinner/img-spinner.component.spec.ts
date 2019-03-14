import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgSpinnerComponent } from './img-spinner.component';

describe('ImgSpinnerComponent', () => {
  let component: ImgSpinnerComponent;
  let fixture: ComponentFixture<ImgSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImgSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
