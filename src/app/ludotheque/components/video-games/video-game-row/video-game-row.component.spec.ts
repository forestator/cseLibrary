import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGameRowComponent} from './video-game-row.component';

describe('VideoGameRowComponent', () => {
  let component: VideoGameRowComponent;
  let fixture: ComponentFixture<VideoGameRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoGameRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGameRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
