import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SonoTableComponent} from './sono-table.component';

describe('SonoTableComponent', () => {
  let component: SonoTableComponent;
  let fixture: ComponentFixture<SonoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SonoTableComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(SonoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
