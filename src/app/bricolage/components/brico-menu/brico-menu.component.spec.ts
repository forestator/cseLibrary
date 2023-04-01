import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BricoMenuComponent} from './brico-menu.component';

describe('BricoMenuComponent', () => {
  let component: BricoMenuComponent;
  let fixture: ComponentFixture<BricoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BricoMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BricoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
