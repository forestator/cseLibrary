import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadGameComponent} from './upload-game.component';

describe('UploadGameComponent', () => {
  let component: UploadGameComponent;
  let fixture: ComponentFixture<UploadGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
