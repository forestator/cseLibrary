import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoGameConsoleRowComponent} from './video-game-console-row.component';

describe('VideoGameConsoleRowComponent', () => {
  let component: VideoGameConsoleRowComponent;
  let fixture: ComponentFixture<VideoGameConsoleRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoGameConsoleRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoGameConsoleRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
