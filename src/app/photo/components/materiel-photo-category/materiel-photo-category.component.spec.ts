import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterielPhotoCategoryComponent} from './materiel-photo-category.component';

describe('SonoCategoryComponent', () => {
  let component: MaterielPhotoCategoryComponent;
  let fixture: ComponentFixture<MaterielPhotoCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterielPhotoCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterielPhotoCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
