import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SonoItemRowComponent} from './sono-item-row.component';

describe('SonoItemRowComponent', () => {
  let component: SonoItemRowComponent;
  let fixture: ComponentFixture<SonoItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SonoItemRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SonoItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
