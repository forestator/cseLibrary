import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BricolageHomeComponent} from './bricolage-home.component';

describe('BricolageHomeComponent', () => {
  let component: BricolageHomeComponent;
  let fixture: ComponentFixture<BricolageHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BricolageHomeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BricolageHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
