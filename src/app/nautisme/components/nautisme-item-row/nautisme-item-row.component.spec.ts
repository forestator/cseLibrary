import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NautismeItemRowComponent} from './nautisme-item-row.component';

describe('NautismeItemRowComponent', () => {
  let component: NautismeItemRowComponent;
  let fixture: ComponentFixture<NautismeItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NautismeItemRowComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NautismeItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
