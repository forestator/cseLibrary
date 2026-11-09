import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SonoHomeComponent} from './sono-home.component';

describe('SonoHomeComponent', () => {
  let component: SonoHomeComponent;
  let fixture: ComponentFixture<SonoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SonoHomeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SonoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
