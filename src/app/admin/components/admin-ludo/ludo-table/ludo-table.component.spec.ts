import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LudoTableComponent} from './ludo-table.component';

describe('LudoBorrowTableComponent', () => {
  let component: LudoTableComponent;
  let fixture: ComponentFixture<LudoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LudoTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LudoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
