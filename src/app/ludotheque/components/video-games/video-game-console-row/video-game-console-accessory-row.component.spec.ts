import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGameConsoleAccessoryRowComponent} from './video-game-console-accessory-row.component';

describe('VideoGameConsoleRowComponent', () => {
  let component: VideoGameConsoleAccessoryRowComponent;
  let fixture: ComponentFixture<VideoGameConsoleAccessoryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoGameConsoleAccessoryRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGameConsoleAccessoryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
