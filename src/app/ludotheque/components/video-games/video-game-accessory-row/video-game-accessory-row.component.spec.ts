import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGameAccessoryRowComponent} from './video-game-accessory-row.component';

describe('VideoGameAccessoryRowComponent', () => {
  let component: VideoGameAccessoryRowComponent;
  let fixture: ComponentFixture<VideoGameAccessoryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoGameAccessoryRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGameAccessoryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
