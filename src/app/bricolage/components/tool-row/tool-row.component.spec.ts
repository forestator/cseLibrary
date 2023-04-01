import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolRowComponent} from './tool-row.component';

describe('ToolRowComponent', () => {
  let component: ToolRowComponent;
  let fixture: ComponentFixture<ToolRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
