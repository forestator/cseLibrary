import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LudoMenuComponent} from './ludo-menu.component';

describe('LudoMenuComponent', () => {
  let component: LudoMenuComponent;
  let fixture: ComponentFixture<LudoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LudoMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LudoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
