import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BricoCategoryComponent} from './brico-category.component';

describe('BricoCategoryComponent', () => {
  let component: BricoCategoryComponent;
  let fixture: ComponentFixture<BricoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BricoCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BricoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
