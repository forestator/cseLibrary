import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LudothequeComponent } from './ludotheque.component';

describe('LudothequeComponent', () => {
  let component: LudothequeComponent;
  let fixture: ComponentFixture<LudothequeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LudothequeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LudothequeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
