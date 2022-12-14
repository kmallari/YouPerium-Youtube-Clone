import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageDisplayComponent } from './error-message-display.component';

describe('ErrorMessageDisplayComponent', () => {
  let component: ErrorMessageDisplayComponent;
  let fixture: ComponentFixture<ErrorMessageDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMessageDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMessageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
