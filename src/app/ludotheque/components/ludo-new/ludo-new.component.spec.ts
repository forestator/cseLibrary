import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LudoNewComponent} from './ludo-new.component';

describe('LudoNewComponent', () => {
  let component: LudoNewComponent;
  let fixture: ComponentFixture<LudoNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [LudoNewComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(LudoNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
