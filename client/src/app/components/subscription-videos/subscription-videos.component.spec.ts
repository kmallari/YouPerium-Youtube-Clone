import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionVideosComponent } from './subscription-videos.component';

describe('SubscriptionVideosComponent', () => {
  let component: SubscriptionVideosComponent;
  let fixture: ComponentFixture<SubscriptionVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscriptionVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
