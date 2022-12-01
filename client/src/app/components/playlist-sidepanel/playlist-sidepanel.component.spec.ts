import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSidepanelComponent } from './playlist-sidepanel.component';

describe('PlaylistSidepanelComponent', () => {
  let component: PlaylistSidepanelComponent;
  let fixture: ComponentFixture<PlaylistSidepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistSidepanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
