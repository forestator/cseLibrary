import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BricoTableComponent} from './brico-table.component';

describe('BricoTableComponent', () => {
  let component: BricoTableComponent;
  let fixture: ComponentFixture<BricoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BricoTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BricoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
