import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreVideosComponent } from './explore-videos.component';

describe('ExploreVideosComponent', () => {
  let component: ExploreVideosComponent;
  let fixture: ComponentFixture<ExploreVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
