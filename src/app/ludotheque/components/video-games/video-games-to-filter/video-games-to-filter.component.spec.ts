import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGamesToFilterComponent} from './video-games-to-filter.component';

describe('VideoGamesToFilterComponent', () => {
  let component: VideoGamesToFilterComponent;
  let fixture: ComponentFixture<VideoGamesToFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [VideoGamesToFilterComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(VideoGamesToFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
