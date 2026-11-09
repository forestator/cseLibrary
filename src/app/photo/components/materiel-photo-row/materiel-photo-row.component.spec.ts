import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MaterielPhotoRowComponent} from './materiel-photo-row.component';

describe('NautismeItemRowComponent', () => {
  let component: MaterielPhotoRowComponent;
  let fixture: ComponentFixture<MaterielPhotoRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [MaterielPhotoRowComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(MaterielPhotoRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
