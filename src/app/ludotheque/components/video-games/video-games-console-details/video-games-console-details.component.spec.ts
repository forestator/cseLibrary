import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGamesConsoleDetailsComponent} from './video-games-console-details.component';

describe('VideoGamesConsoleDetailsComponent', () => {
  let component: VideoGamesConsoleDetailsComponent;
  let fixture: ComponentFixture<VideoGamesConsoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VideoGamesConsoleDetailsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGamesConsoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
